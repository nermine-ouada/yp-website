// Fills the Event and Person tables with the content that used to be
// hard-coded in src/data. Only seeds a table while it's empty, so running it
// again never duplicates or overwrites dashboard edits.
//   npm run db:seed
import { PrismaClient } from "@prisma/client";
import { events } from "../src/data/events";
import { ambassadors, officers, taskForce } from "../src/data/ypTunisia";

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.event.count()) === 0) {
    await prisma.event.createMany({
      data: events.map((e, i) => ({
        slug: e.slug,
        title: e.title,
        type: e.type,
        date: e.date ?? null,
        time: e.time ?? null,
        format: e.format ?? null,
        venue: e.venue ?? null,
        partOf: e.partOf ?? null,
        hosts: e.hosts ?? [],
        coHosts: e.coHosts ?? [],
        speakers: (e.speakers ?? []).map((s) => ({ ...s })),
        moderator: e.moderator ? { ...e.moderator } : undefined,
        summary: e.summary,
        description: e.description ?? null,
        images: e.images,
        registrationUrl: e.registrationUrl ?? null,
        initiative: e.initiative ?? false,
        // keep the original listing order for undated items
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, 0, i)),
      })),
    });
    console.log(`Seeded ${events.length} events`);
  } else {
    console.log("Event table not empty, skipped");
  }

  if ((await prisma.person.count()) === 0) {
    let order = 0;
    const rows = [
      ...officers.map((o) => ({ group: "officer", ...o })),
      ...taskForce.flatMap((c) => c.members.map((m) => ({ group: "taskforce", committee: c.committee, ...m }))),
      ...ambassadors.map((a) => ({ group: "ambassador", ...a })),
    ];
    await prisma.person.createMany({
      data: rows.map((p) => ({
        group: p.group,
        name: p.name,
        role: p.role ?? null,
        committee: "committee" in p ? (p.committee as string) : null,
        branch: "branch" in p ? (p.branch ?? null) : null,
        membership: p.membership ?? null,
        photo: p.photo ?? null,
        facebook: "facebook" in p ? (p.facebook ?? null) : null,
        sortOrder: order++,
      })),
    });
    console.log(`Seeded ${rows.length} people`);
  } else {
    console.log("Person table not empty, skipped");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
