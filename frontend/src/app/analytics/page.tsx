import { Playfair_Display } from 'next/font/google';
import Analytics from '@/components/Analytics';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className={`${playfair.className} text-3xl font-semibold mb-6`}>
        <span className="bg-[#F8C4A9] px-2 py-1 rounded">Analytics Dashboard</span>
      </h1>
      <Analytics />
    </div>
  );
} 