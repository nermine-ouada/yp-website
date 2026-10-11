import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "../../content-actions";

export default function NewEventPage() {
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Add an event</h1>
          </div>
          <Link href="/admin/events" className="admin-link-btn">
            ← back to events
          </Link>
        </div>
        <EventForm action={createEvent} submitLabel="Add event" />
      </div>
    </main>
  );
}
