import ContentCreator from '@/components/ContentCreator';

export const metadata = {
  title: 'AI Content Creator - Memory Bank',
  description: 'Create AI-generated content for your social media accounts',
};

export default function CreatePage() {
  return (
    <main className="p-4 md:p-8">
      <ContentCreator />
    </main>
  );
} 