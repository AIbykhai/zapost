import SchedulingCalendar from '@/components/SchedulingCalendar';
import ScheduledPostsList from '@/components/ScheduledPostsList';

export default function SchedulingPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-playfair mb-8">
        Scheduling
      </h1>
      
      <div className="space-y-10">
        <SchedulingCalendar />
        <ScheduledPostsList />
      </div>
    </div>
  );
} 