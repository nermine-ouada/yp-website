"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";

function readOpportunityForm(formData: FormData) {
  const field = (name: string) => String(formData.get(name) ?? "").trim();
  return {
    sheet: field("sheet"),
    title: field("title"),
    category: field("category"),
    level: field("level"),
    who: field("who"),
    award: field("award"),
    deadline: field("deadline"),
    status: field("status"),
    membership: field("membership"),
    notes: field("notes"),
    link: field("link"),
  };
}

export async function createOpportunity(formData: FormData) {
  await assertAdmin();
  const data = readOpportunityForm(formData);
  await prisma.opportunity.create({ data: { ...data, sortOrder: 0 } });
  revalidatePath("/");
  revalidatePath("/opportunities");
  redirect("/admin");
}

export async function updateOpportunity(id: string, formData: FormData) {
  await assertAdmin();
  const data = readOpportunityForm(formData);
  await prisma.opportunity.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/opportunities");
  redirect("/admin");
}

// Soft delete: move to trash instead of removing the row. Public board query
// already excludes anything with deletedAt set.
export async function deleteOpportunity(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.opportunity.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/");
  revalidatePath("/opportunities");
  redirect("/admin");
}

// Show/hide on the public board without deleting. No redirect: re-rendering
// the current admin page keeps the admin's search/filter params.
export async function setOpportunityHidden(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const hidden = formData.get("hidden") === "true";
  await prisma.opportunity.update({ where: { id }, data: { hidden } });
  revalidatePath("/");
  revalidatePath("/opportunities");
  revalidatePath("/links");
  revalidatePath("/admin");
}

export async function recoverOpportunity(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.opportunity.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/");
  revalidatePath("/opportunities");
  redirect("/admin/trash");
}

// Permanent: actually removes every trashed row from the database.
export async function emptyTrash() {
  await assertAdmin();
  await prisma.opportunity.deleteMany({ where: { deletedAt: { not: null } } });
  redirect("/admin/trash");
}

// Permanent: removes a single trashed row from the database.
export async function permanentlyDeleteOpportunity(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.opportunity.delete({ where: { id } });
  redirect("/admin/trash");
}

export type BulkOpportunityRow = {
  sheet: string;
  title: string;
  category: string;
  level: string;
  who: string;
  award: string;
  deadline: string;
  status: string;
  membership: string;
  notes: string;
  link: string;
};

// Called imperatively from the import wizard (not a <form action>), after the
// admin has reviewed every row client-side — so no redirect() here, the
// caller decides what to do once it resolves.
export async function bulkCreateOpportunities(rows: BulkOpportunityRow[]) {
  await assertAdmin();
  if (!Array.isArray(rows) || rows.length === 0) return { count: 0 };
  await prisma.opportunity.createMany({
    data: rows.map((r, i) => ({
      sheet: r.sheet,
      title: r.title,
      category: r.category,
      level: r.level,
      who: r.who,
      award: r.award,
      deadline: r.deadline,
      status: r.status,
      membership: r.membership,
      notes: r.notes ?? "",
      link: r.link,
      sortOrder: i,
    })),
  });
  revalidatePath("/");
  revalidatePath("/opportunities");
  return { count: rows.length };
}
