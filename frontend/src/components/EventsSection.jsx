import { events } from '../data/mockData';
import EventCard from './EventCard';
import SectionHeader from './SectionHeader';

const EventsSection = () => {
  return (
    <section className="space-y-8">
      <SectionHeader
        eyebrow="Upcoming Events"
        title="Featured tournaments and matches"
        description="Promote tournaments with rich event cards, detailed schedules, and one-tap registration."
        actionLabel="View All Events"
      />
      <div className="grid gap-5 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
