"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";
import { mergeSite, type SiteContent } from "@/data/site";

// ---------- helpers ----------

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

const text = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
const optional = (fd: FormData, name: string) => text(fd, name) || null;
const lines = (fd: FormData, name: string) =>
  text(fd, name)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

// "Name | Title" per line -> [{ name, title? }]
function people(raw: string[]) {
  return raw.map((l) => {
    const [name, ...rest] = l.split("|").map((s) => s.trim());
    const title = rest.join(" | ");
    return title ? { name, title } : { name };
  });
}

// "Label | https://..." per line -> [{ label, url }]
function links(raw: string[]) {
  return raw
    .map((l) => {
      const i = l.lastIndexOf("|");
      return i === -1 ? null : { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() };
    })
    .filter((l): l is { label: string; url: string } => !!l && !!l.label && !!l.url);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Stores every uploaded image in the form field and returns their URLs.
async function saveUploads(fd: FormData, name: string): Promise<string[]> {
  const files = fd.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error(`${file.name}: only JPEG, PNG, WebP or GIF images`);
    if (file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name}: images must be 3 MB or smaller`);
    const row = await prisma.upload.create({
      data: {
        filename: file.name.slice(0, 200),
        contentType: file.type,
        size: file.size,
        data: Buffer.from(await file.arrayBuffer()),
      },
      select: { id: true },
    });
    urls.push(`/api/uploads/${row.id}`);
  }
  return urls;
}

function refreshPublicPages() {
  for (const p of ["/", "/events", "/officers", "/about", "/contact", "/links", "/opportunities"]) revalidatePath(p);
  revalidatePath("/events/[slug]", "page");
}

// ---------- events ----------

async function readEvent(fd: FormData) {
  const title = text(fd, "title");
  const images = [...lines(fd, "images"), ...(await saveUploads(fd, "imageFiles"))];
  const moderator = people(lines(fd, "moderator"))[0];
  return {
    title,
    slug: slugify(text(fd, "slug") || title),
    type: text(fd, "type") || "Announcement",
    date: optional(fd, "date"),
    time: optional(fd, "time"),
    format: optional(fd, "format"),
    venue: optional(fd, "venue"),
    partOf: optional(fd, "partOf"),
    hosts: lines(fd, "hosts"),
    coHosts: lines(fd, "coHosts"),
    speakers: people(lines(fd, "speakers")),
    moderator,
    summary: text(fd, "summary"),
    description: optional(fd, "description"),
    images,
    registrationUrl: optional(fd, "registrationUrl"),
    initiative: fd.get("initiative") === "on",
    hidden: fd.get("hidden") === "on",
  };
}

async function uniqueSlug(slug: string, exceptId?: string) {
  let candidate = slug || "event";
  for (let n = 2; ; n++) {
    const clash = await prisma.event.findFirst({ where: { slug: candidate, NOT: exceptId ? { id: exceptId } : undefined } });
    if (!clash) return candidate;
    candidate = `${slug}-${n}`;
  }
}

export async function createEvent(fd: FormData) {
  await assertAdmin();
  const data = await readEvent(fd);
  data.slug = await uniqueSlug(data.slug);
  await prisma.event.create({ data: { ...data, moderator: data.moderator ?? Prisma.DbNull } });
  refreshPublicPages();
  redirect("/admin/events");
}

export async function updateEvent(id: string, fd: FormData) {
  await assertAdmin();
  const data = await readEvent(fd);
  data.slug = await uniqueSlug(data.slug, id);
  await prisma.event.update({ where: { id }, data: { ...data, moderator: data.moderator ?? Prisma.DbNull } });
  refreshPublicPages();
  redirect("/admin/events");
}

export async function setEventHidden(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.event.update({ where: { id }, data: { hidden: fd.get("hidden") === "true" } });
  refreshPublicPages();
  revalidatePath("/admin/events");
}

// Delete = move to the dashboard trash (see /admin/trash).
export async function deleteEvent(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
  refreshPublicPages();
  revalidatePath("/admin/events");
}

export async function recoverEvent(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.event.update({ where: { id }, data: { deletedAt: null } });
  refreshPublicPages();
  revalidatePath("/admin/trash");
}

export async function permanentlyDeleteEvent(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/trash");
}

// ---------- people ----------

const GROUPS = ["officer", "taskforce", "ambassador"];
const GRADES = ["Member", "Graduate Student Member", "Student Member"];

async function readPerson(fd: FormData) {
  const group = GROUPS.includes(text(fd, "group")) ? text(fd, "group") : "taskforce";
  const membership = GRADES.includes(text(fd, "membership")) ? text(fd, "membership") : null;
  const [uploaded] = await saveUploads(fd, "photoFile");
  return {
    group,
    name: text(fd, "name"),
    role: optional(fd, "role"),
    committee: group === "taskforce" ? optional(fd, "committee") : null,
    branch: group === "ambassador" ? optional(fd, "branch") : null,
    membership,
    photo: uploaded ?? optional(fd, "photo"),
    facebook: optional(fd, "facebook"),
    sortOrder: Number.parseInt(text(fd, "sortOrder"), 10) || 0,
    hidden: fd.get("hidden") === "on",
  };
}

export async function createPerson(fd: FormData) {
  await assertAdmin();
  const data = await readPerson(fd);
  await prisma.person.create({ data });
  refreshPublicPages();
  redirect(`/admin/team?group=${data.group}`);
}

export async function updatePerson(id: string, fd: FormData) {
  await assertAdmin();
  const data = await readPerson(fd);
  await prisma.person.update({ where: { id }, data });
  refreshPublicPages();
  redirect(`/admin/team?group=${data.group}`);
}

export async function setPersonHidden(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.person.update({ where: { id }, data: { hidden: fd.get("hidden") === "true" } });
  refreshPublicPages();
  revalidatePath("/admin/team");
}

// Delete = move to the dashboard trash (see /admin/trash).
export async function deletePerson(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.person.update({ where: { id }, data: { deletedAt: new Date() } });
  refreshPublicPages();
  revalidatePath("/admin/team");
}

export async function recoverPerson(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.person.update({ where: { id }, data: { deletedAt: null } });
  refreshPublicPages();
  revalidatePath("/admin/trash");
}

export async function permanentlyDeletePerson(fd: FormData) {
  await assertAdmin();
  const id = text(fd, "id");
  if (!id) return;
  await prisma.person.delete({ where: { id } });
  revalidatePath("/admin/trash");
}

// ---------- trash (all sections) ----------

// Permanent: removes every trashed opportunity, event and person.
export async function emptyAllTrash() {
  await assertAdmin();
  await prisma.$transaction([
    prisma.opportunity.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.event.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.person.deleteMany({ where: { deletedAt: { not: null } } }),
  ]);
  redirect("/admin/trash");
}

// ---------- bulk import ----------
// Called from the import wizard after the admin reviewed every row, so no
// redirect here; the wizard shows the result.

export type BulkEventRow = {
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  summary: string;
  speakers: string; // "Name | Title; Name | Title"
  description: string;
  format: string;
  partOf: string;
  hosts: string; // separated by ";"
  coHosts: string;
  images: string; // URLs separated by ";"
  registrationUrl: string;
  initiative: string; // yes / no
};

export type BulkPersonRow = {
  group: string; // officer | taskforce | ambassador
  name: string;
  role: string;
  committee: string;
  branch: string;
  membership: string;
  photo: string;
  facebook: string;
};

const split = (v: string) =>
  String(v ?? "")
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean);
const yes = (v: string) => /^(y|yes|true|1|x)$/i.test(String(v ?? "").trim());

export async function bulkCreateEvents(rows: BulkEventRow[]) {
  await assertAdmin();
  if (!Array.isArray(rows) || rows.length === 0) return { count: 0 };
  let count = 0;
  for (const r of rows) {
    if (!r.title?.trim() || !r.summary?.trim()) continue;
    await prisma.event.create({
      data: {
        title: r.title.trim(),
        slug: await uniqueSlug(slugify(r.title)),
        type: r.type?.trim() || "Announcement",
        date: /^\d{4}-\d{2}-\d{2}$/.test(r.date?.trim() ?? "") ? r.date.trim() : null,
        time: r.time?.trim() || null,
        venue: r.venue?.trim() || null,
        summary: r.summary.trim(),
        speakers: people(split(r.speakers)),
        description: r.description?.trim() || null,
        format: ["Online", "In person"].includes(r.format?.trim()) ? r.format.trim() : null,
        partOf: r.partOf?.trim() || null,
        hosts: split(r.hosts),
        coHosts: split(r.coHosts),
        images: split(r.images),
        registrationUrl: r.registrationUrl?.trim() || null,
        initiative: yes(r.initiative),
      },
    });
    count++;
  }
  refreshPublicPages();
  return { count };
}

export async function bulkCreatePeople(rows: BulkPersonRow[]) {
  await assertAdmin();
  if (!Array.isArray(rows) || rows.length === 0) return { count: 0 };
  const start = (await prisma.person.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0;
  const data = rows
    .filter((r) => r.name?.trim() && GROUPS.includes(r.group))
    .map((r, i) => ({
      group: r.group,
      name: r.name.trim(),
      role: r.role?.trim() || null,
      committee: r.group === "taskforce" ? r.committee?.trim() || null : null,
      branch: r.group === "ambassador" ? r.branch?.trim() || null : null,
      membership: GRADES.includes(r.membership?.trim()) ? r.membership.trim() : null,
      photo: r.photo?.trim() || null,
      facebook: r.facebook?.trim() || null,
      sortOrder: start + 1 + i,
    }));
  await prisma.person.createMany({ data });
  refreshPublicPages();
  return { count: data.length };
}

// ---------- site text ----------

export async function updateSite(fd: FormData) {
  await assertAdmin();
  const value: SiteContent = mergeSite({
    name: text(fd, "name"),
    copyright: text(fd, "copyright"),
    joinUrl: text(fd, "joinUrl"),
    introVideoId: text(fd, "introVideoId"),
    aboutVideo: text(fd, "aboutVideo"),
    officersTerm: text(fd, "officersTerm"),
    heroTitle: text(fd, "heroTitle"),
    heroText: text(fd, "heroText"),
    stats: links(lines(fd, "stats")).map((l) => ({ value: l.url, label: l.label })),
    about: {
      intro: text(fd, "about.intro"),
      missionSummary: text(fd, "about.missionSummary"),
      missionPoints: lines(fd, "about.missionPoints"),
      missionConclusion: text(fd, "about.missionConclusion"),
      valuesIntro: text(fd, "about.valuesIntro"),
      valuesPoints: lines(fd, "about.valuesPoints"),
      invitation: text(fd, "about.invitation"),
    },
    contact: {
      email: text(fd, "contact.email"),
      phone: text(fd, "contact.phone"),
      facebook: text(fd, "contact.facebook"),
      linkedin: text(fd, "contact.linkedin"),
      instagram: text(fd, "contact.instagram"),
      hours: "",
      days: "",
      location: text(fd, "contact.location"),
    },
    impact: {
      title: text(fd, "impact.title"),
      yearBefore: text(fd, "impact.yearBefore"),
      yearAfter: text(fd, "impact.yearAfter"),
      membersValue: text(fd, "impact.membersValue"),
      membersLabel: text(fd, "impact.membersLabel"),
      membersNote: text(fd, "impact.membersNote"),
      // "Label | 2025 value | 2026 value | note" per line
      kpis: lines(fd, "impact.kpis")
        .map((l) => l.split("|").map((x) => x.trim()))
        .filter((c) => c[0] && c[1] && c[2])
        .map(([label, before, after, note]) => (note ? { label, before, after, note } : { label, before, after })),
      activities: lines(fd, "impact.activities"),
      award: text(fd, "impact.award"),
    },
    footerLinks: links(lines(fd, "footerLinks")),
    usefulLinks: links(lines(fd, "usefulLinks")),
  });
  await prisma.setting.upsert({
    where: { key: "site" },
    create: { key: "site", value: value as object },
    update: { value: value as object },
  });
  refreshPublicPages();
  redirect("/admin/site?saved=1");
}
