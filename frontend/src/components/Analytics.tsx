"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Playfair_Display, Inter } from 'next/font/google';

// Initialize fonts at module level
const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

interface KeyMetrics {
  totalPosts: number;
  scheduledPosts: number;
  totalReach: number;
  totalEngagement: number;
}

interface Post {
  id: string;
  content: string;
  platform: string;
  reach: number;
  engagement: number;
  created_at: string;
}

const Analytics: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [platform, setPlatform] = useState<string>('');
  const [metrics, setMetrics] = useState<KeyMetrics | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const userId = 'current-user-id'; // Replace with actual user ID from auth
      const metricsResponse = await fetch(
        `/api/analytics?path=metrics&userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const postsResponse = await fetch(
        `/api/analytics?path=recent-posts&userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&platform=${platform}`
      );

      const metricsData = await metricsResponse.json();
      const postsData = await postsResponse.json();

      setMetrics(metricsData);
      setRecentPosts(postsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, platform]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-6">
      <h1 className={`${playfair.className} text-3xl mb-6`}>Analytics Dashboard</h1>
      
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${inter.className}`}>Start Date</label>
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${inter.className}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${inter.className}`}>End Date</label>
          <input
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${inter.className}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${inter.className}`}>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${inter.className}`}
          >
            <option value="">All Platforms</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Posts</h3>
            <p className="text-2xl font-bold">{metrics.totalPosts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Scheduled Posts</h3>
            <p className="text-2xl font-bold">{metrics.scheduledPosts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Reach</h3>
            <p className="text-2xl font-bold">{metrics.totalReach.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Engagement</h3>
            <p className="text-2xl font-bold">{metrics.totalEngagement.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Recent Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.platform}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.reach.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.engagement.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics; 