import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "@/components/admin/PersonForm";
import { updatePerson } from "../../content-actions";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [person, committees] = await Promise.all([
    prisma.person.findUnique({ where: { id } }),
    prisma.person
      .findMany({ where: { committee: { not: null }, deletedAt: null }, distinct: ["committee"], select: { committee: true } })
      .then((rows) => rows.map((r) => r.committee as string)),
  ]);
  if (!person) notFound();

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Edit {person.name}</h1>
          </div>
          <Link href={`/admin/team?group=${person.group}`} className="admin-link-btn">
            ← back to team
          </Link>
        </div>
        <PersonForm
          action={updatePerson.bind(null, id)}
          initial={person}
          defaultGroup={person.group}
          committees={committees}
          submitLabel="Save changes"
        />
      </div>
    </main>
  );
}
