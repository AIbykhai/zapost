"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContentImportScreen: React.FC = () => {
  const router = useRouter();
  const [importMethod, setImportMethod] = useState<'text' | 'link'>('text');
  const [textContent, setTextContent] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [vocabularyList, setVocabularyList] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real implementation, this would be an API call to the backend
      const response = await fetch('/api/onboarding/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          importMethod,
          content: importMethod === 'text' ? textContent : socialLink,
          vocabularyList,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      // For now, we'll just navigate to the next screen
      // In a real implementation, we would use the response data
      router.push('/onboarding/brand-profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-playfair mb-6">
        Import Your <span className="bg-peach-light px-2 py-1 rounded-lg">Content</span>
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-inter ${
                importMethod === 'text'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setImportMethod('text')}
            >
              Paste Text
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-inter ${
                importMethod === 'link'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setImportMethod('link')}
            >
              Social Media Link
            </button>
          </div>

          {importMethod === 'text' ? (
            <div>
              <label className="block text-gray-700 mb-2 font-inter">
                Paste up to 3 of your best existing posts or articles:
              </label>
              <textarea
                className="w-full h-48 p-3 border border-gray-300 rounded-lg font-inter"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your content here..."
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 mb-2 font-inter">
                Provide a link to your social account (Facebook, Instagram, LinkedIn, X):
              </label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 rounded-lg font-inter"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="https://www.facebook.com/yourbusiness"
                required
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-inter">
            Brand Vocabulary (optional):
          </label>
          <textarea
            className="w-full h-24 p-3 border border-gray-300 rounded-lg font-inter"
            value={vocabularyList}
            onChange={(e) => setVocabularyList(e.target.value)}
            placeholder="Enter unique words and phrases that represent your brand, separated by commas..."
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-inter font-medium text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400"
            disabled={isLoading || (importMethod === 'text' && !textContent) || (importMethod === 'link' && !socialLink)}
          >
            {isLoading ? 'Analyzing...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentImportScreen; 