"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// For demo purposes, mock data that would normally come from the API
const initialProfileData = {
  brandVoice: 'Your brand voice is friendly, professional, and approachable. You communicate with clarity and confidence while maintaining a conversational tone that resonates with your audience.',
  vocabularyList: ['innovative', 'handcrafted', 'artisanal', 'premium', 'quality', 'authentic', 'sustainable'],
  tone: 'friendly',
  targetAudience: 'Local professionals aged 25-45 interested in specialty products and experiences',
};

const BrandProfileScreen: React.FC = () => {
  const router = useRouter();
  const [brandVoice, setBrandVoice] = useState(initialProfileData.brandVoice);
  const [vocabularyList, setVocabularyList] = useState(initialProfileData.vocabularyList.join(', '));
  const [tone, setTone] = useState(initialProfileData.tone);
  const [targetAudience, setTargetAudience] = useState(initialProfileData.targetAudience);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // In a real implementation, we would fetch the brand profile data from the API here
  useEffect(() => {
    // Mock API loading delay
    const timer = setTimeout(() => {
      // Here we would normally fetch data from the API
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real implementation, this would be an API call to the backend
      const response = await fetch('/api/onboarding/save-brand-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandVoice,
          vocabularyList: vocabularyList.split(',').map(item => item.trim()),
          tone,
          targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save brand profile');
      }

      // Navigate to the dashboard or content creator
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-playfair mb-6">
        Your <span className="bg-peach-light px-2 py-1 rounded-lg">Brand Profile</span>
      </h1>

      <p className="text-lg mb-6 font-inter">
        We&apos;ve created a brand profile for you. 
        Feel free to edit any of these fields to better match your brand.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2 font-inter font-medium">
            Brand Voice
          </label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-inter"
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-inter font-medium">
            Brand Vocabulary
          </label>
          <textarea
            className="w-full h-24 p-3 border border-gray-300 rounded-lg font-inter"
            value={vocabularyList}
            onChange={(e) => setVocabularyList(e.target.value)}
            placeholder="Enter words and phrases separated by commas..."
            required
          />
          <p className="text-sm text-gray-600 mt-1 font-inter">
            Comma-separated list of words and phrases that represent your brand.
          </p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-inter font-medium">
            Tone
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg font-inter"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            required
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="humorous">Humorous</option>
            <option value="inspirational">Inspirational</option>
            <option value="authoritative">Authoritative</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-inter font-medium">
            Target Audience
          </label>
          <textarea
            className="w-full h-24 p-3 border border-gray-300 rounded-lg font-inter"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-inter font-medium text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Brand Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandProfileScreen; 