import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";
import { updateEvent } from "../../content-actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Edit event</h1>
          </div>
          <Link href="/admin/events" className="admin-link-btn">
            ← back to events
          </Link>
        </div>
        <EventForm action={updateEvent.bind(null, id)} initial={event} submitLabel="Save changes" />
      </div>
    </main>
  );
}
