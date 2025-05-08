'use client';

import { useState, useEffect } from 'react';
import SchedulingModal from './SchedulingModal';
import { Playfair_Display, Inter } from 'next/font/google';

// Initialize fonts at module level
const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook';
type Theme = 'promotional' | 'educational' | 'entertaining' | 'inspirational';

interface ContentCreatorProps {
  initialContent?: string;
  initialTheme?: Theme;
  initialPlatform?: Platform;
}

export default function ContentCreator({ 
  initialContent = '', 
  initialTheme = 'educational',
  initialPlatform = 'twitter'
}: ContentCreatorProps) {
  const [prompt, setPrompt] = useState(initialContent);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);

  const platformLimits = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    facebook: 5000
  };

  useEffect(() => {
    setCharacterCount(generatedContent.length);
  }, [generatedContent]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          theme,
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError('An error occurred while generating content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = () => {
    setShowSchedulingModal(true);
  };

  const getCharacterLimitColor = () => {
    const limit = platformLimits[platform];
    const percentage = (characterCount / limit) * 100;
    
    if (percentage > 95) return 'text-red-500';
    if (percentage > 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className={`text-3xl ${playfair.className} mb-6`}>
        <span className="bg-[#F8C4A9] px-3 py-1 rounded-lg">AI Content Creator</span>
      </h1>
      
      <div className="mb-6">
        <label htmlFor="prompt" className={`block mb-2 ${inter.className} font-medium`}>
          What would you like to post about?
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your content idea (e.g., 'Announce our new product launch')"
          className={`w-full h-32 p-3 border border-gray-300 rounded-md ${inter.className}`}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="theme" className={`block mb-2 ${inter.className} font-medium`}>
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className={`w-full p-3 border border-gray-300 rounded-md ${inter.className}`}
          >
            <option value="promotional">Promotional</option>
            <option value="educational">Educational</option>
            <option value="entertaining">Entertaining</option>
            <option value="inspirational">Inspirational</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="platform" className={`block mb-2 ${inter.className} font-medium`}>
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className={`w-full p-3 border border-gray-300 rounded-md ${inter.className}`}
          >
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`bg-[#E67E22] text-white px-6 py-2 rounded-md ${inter.className} hover:bg-orange-600 transition duration-200 disabled:bg-gray-400`}
      >
        {loading ? 'Generating...' : 'Generate Post'}
      </button>
      
      {error && (
        <div className={`mt-4 p-3 bg-red-100 text-red-700 rounded-md ${inter.className}`}>
          {error}
        </div>
      )}
      
      {generatedContent && (
        <div className="mt-6 border border-gray-300 rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className={`${playfair.className} text-xl`}>Generated Post</h3>
            <span className={`${inter.className} text-sm ${getCharacterLimitColor()}`}>
              {characterCount} / {platformLimits[platform]} characters
            </span>
          </div>
          
          <textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            className={`w-full h-48 p-3 border border-gray-300 rounded-md ${inter.className} mb-4`}
          />
          
          <button
            onClick={handleSchedule}
            className={`bg-[#E67E22] text-white px-6 py-2 rounded-md ${inter.className} hover:bg-orange-600 transition duration-200`}
          >
            Schedule Post
          </button>
        </div>
      )}
      
      {/* Scheduling Modal */}
      <SchedulingModal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        content={generatedContent}
        initialPlatform={platform}
      />
    </div>
  );
} 