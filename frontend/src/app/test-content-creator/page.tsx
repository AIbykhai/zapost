'use client';

import { useState, FormEvent } from 'react';

export default function TestContentCreator() {
  const [prompt, setPrompt] = useState('Announce a new product launch for a tech company');
  const [theme, setTheme] = useState('promotional');
  const [platform, setPlatform] = useState('twitter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setResult(data.content);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-playfair mb-6">
        <span className="bg-[#F8C4A9] px-3 py-1 rounded-lg">Test Content Creator</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2 font-inter font-medium">Prompt</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="theme" className="block mb-2 font-inter font-medium">Theme</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="promotional">Promotional</option>
            <option value="educational">Educational</option>
            <option value="entertaining">Entertaining</option>
            <option value="inspirational">Inspirational</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="platform" className="block mb-2 font-inter font-medium">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E67E22] text-white px-6 py-2 rounded-md font-inter hover:bg-orange-600 transition duration-200 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
          Error: {error}
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-md whitespace-pre-wrap">
          <h2 className="text-xl font-playfair mb-2">Generated Content:</h2>
          <div className="font-inter">{result}</div>
        </div>
      )}
    </div>
  );
} 