"use client";

import React, { useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

interface PostAnalysis {
  title: string;
  hook: string;
  theme: string;
  reach: number;
  engagement: number;
}

export default function AccountAnalyst() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PostAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze account');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setAnalysis([]);
    setError(null);
  };

  const handleGenerate = (post: PostAnalysis) => {
    // TODO: Implement content generation based on post analysis
    console.log('Generating content for:', post);
  };

  return (
    <div className="p-6">
      <h1 className={`${playfair.className} text-3xl font-bold mb-6`}>
        <span className="bg-[#F8C4A9] px-2 py-1 rounded">Analyze Account</span>
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter social media URL"
            className={`${inter.className} flex-1 p-2 border rounded`}
            required
          />
          <button
            type="submit"
            className="bg-[#E67E22] text-white px-4 py-2 rounded hover:bg-[#D35400] transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {analysis.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Hook</th>
                <th className="px-4 py-2 border">Theme</th>
                <th className="px-4 py-2 border">Reach</th>
                <th className="px-4 py-2 border">Engagement</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analysis.map((post, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{post.title}</td>
                  <td className="px-4 py-2 border">{post.hook}</td>
                  <td className="px-4 py-2 border">{post.theme}</td>
                  <td className="px-4 py-2 border">{post.reach}</td>
                  <td className="px-4 py-2 border">{post.engagement}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleGenerate(post)}
                      className="bg-[#E67E22] text-white px-3 py-1 rounded hover:bg-[#D35400] transition-colors"
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 