'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  initialPlatform: string;
}

export default function SchedulingModal({
  isOpen,
  onClose,
  content,
  initialPlatform,
}: SchedulingModalProps) {
  const router = useRouter();
  const [platform, setPlatform] = useState(initialPlatform);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default time to current time
    const now = new Date();
    setScheduledTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit');
        return;
      }
      
      setImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      setError('Please select both date and time');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('content', content);
      formData.append('platform', platform);
      formData.append('scheduledTime', `${scheduledDate}T${scheduledTime}`);
      
      if (image) {
        formData.append('image', image);
      }
      
      // Call the API to schedule the post
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule post');
      }
      
      // Close modal and navigate to scheduling page
      onClose();
      router.push('/scheduling');
    } catch (err) {
      setError('An error occurred while scheduling the post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-playfair mb-4">
            <span className="bg-[#F8C4A9] px-3 py-1 rounded-lg">Schedule Post</span>
          </h2>
          
          <div className="mb-4">
            <label className="block mb-2 font-inter font-medium">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md font-inter"
            >
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-inter font-medium">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-md font-inter"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-inter font-medium">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md font-inter"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-inter font-medium">Post Content</label>
            <textarea
              value={content}
              readOnly
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-inter bg-gray-50"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-inter font-medium">Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md font-inter"
            />
            <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB</p>
            
            {imagePreview && (
              <div className="mt-2">
                <Image 
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md font-inter">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md font-inter hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSchedule}
              disabled={loading}
              className="bg-[#E67E22] text-white px-4 py-2 rounded-md font-inter hover:bg-orange-600 transition duration-200 disabled:bg-gray-400"
            >
              {loading ? 'Scheduling...' : 'Schedule Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 