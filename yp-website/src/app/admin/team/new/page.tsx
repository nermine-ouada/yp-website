import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "@/components/admin/PersonForm";
import { createPerson } from "../../content-actions";

export default async function NewPersonPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group = "officer" } = await searchParams;
  const committees = await prisma.person
    .findMany({ where: { committee: { not: null }, deletedAt: null }, distinct: ["committee"], select: { committee: true } })
    .then((rows) => rows.map((r) => r.committee as string));

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Add a person</h1>
          </div>
          <Link href={`/admin/team?group=${group}`} className="admin-link-btn">
            ← back to team
          </Link>
        </div>
        <PersonForm action={createPerson} defaultGroup={group} committees={committees} submitLabel="Add person" />
      </div>
    </main>
  );
}
