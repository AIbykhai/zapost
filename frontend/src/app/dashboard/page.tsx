import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair">
          <span className="bg-peach-light px-2 py-1 rounded-lg">Dashboard</span>
        </h1>
        <Link
          href="/onboarding"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-inter hover:bg-orange-600 transition-colors"
        >
          Update Brand Profile
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 font-inter">Recent Posts</h3>
          <p className="text-3xl font-bold mt-2 font-playfair">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 font-inter">Total Engagement</h3>
          <p className="text-3xl font-bold mt-2 font-playfair">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 font-inter">Audience Growth</h3>
          <p className="text-3xl font-bold mt-2 font-playfair">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 font-inter">Content Queue</h3>
          <p className="text-3xl font-bold mt-2 font-playfair">0</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 font-playfair">Content Creation</h2>
        <p className="text-gray-600 mb-4 font-inter">
          Start creating content for your social media channels.
        </p>
        <Link
          href="#"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-inter hover:bg-orange-600 transition-colors inline-block"
        >
          Create Content
        </Link>
      </div>
    </div>
  );
} 