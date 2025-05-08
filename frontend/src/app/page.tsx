import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl md:text-7xl font-playfair mb-10 leading-tight">
        Turn one article <br /> into a month's worth of <br />
        <span className="relative inline-block">
          <span className="absolute inset-0 bg-peach-light transform -skew-y-1 z-0"></span>
          <span className="relative z-10">email newsletters</span>
        </span>
      </h1>
      
      <p className="text-lg md:text-xl mb-12 max-w-2xl font-inter text-gray-700">
        Transform your videos, articles, and podcasts into bite-sized content that grows your audience while you sleep.
      </p>
      
      <div className="flex gap-6">
        <Link
          href="/onboarding"
          className="bg-orange-500 text-white px-10 py-4 rounded-lg font-inter font-semibold text-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
        >
          Try with your article
        </Link>
      </div>
    </div>
  );
}
