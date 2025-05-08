'use client';

import { useState, useEffect } from 'react';

interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: string;
}

export default function ScheduledPostsList() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const response = await fetch('/api/scheduling');
        
        if (!response.ok) {
          throw new Error('Failed to fetch scheduled posts');
        }
        
        const data = await response.json();
        
        // Sort posts by scheduled time
        const sortedPosts = [...data].sort(
          (a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
        );
        
        setScheduledPosts(sortedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scheduled posts:', err);
        setError('Failed to load scheduled posts');
        setLoading(false);
      }
    };
    
    fetchScheduledPosts();
  }, []);
  
  const handleEdit = (id: string) => {
    // In a real application, this would open an edit modal or navigate to an edit page
    alert(`Edit post with ID: ${id}`);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled post?')) {
      try {
        // In a real application, this would be an API call
        /* 
        const response = await fetch(`/api/scheduling/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        */
        
        // Update local state
        setScheduledPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        
        alert('Post deleted successfully');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return '𝕏';
      case 'instagram':
        return '📷';
      case 'linkedin':
        return '💼';
      case 'facebook':
        return '👍';
      default:
        return '📱';
    }
  };
  
  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      case 'facebook':
        return 'Facebook';
      default:
        return platform;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-playfair mb-6">
        <span className="bg-[#F8C4A9] px-3 py-1 rounded-lg">Upcoming Scheduled Posts</span>
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="font-inter text-gray-600">Loading scheduled posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="font-inter text-red-600">{error}</p>
        </div>
      ) : scheduledPosts.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="font-inter text-gray-600">No scheduled posts yet.</p>
          <p className="font-inter text-gray-500 mt-2">Create content and schedule your first post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledPosts.map(post => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="mr-2 text-xl" title={getPlatformName(post.platform)}>
                    {getPlatformIcon(post.platform)}
                  </span>
                  <span className="font-inter font-medium">
                    {getPlatformName(post.platform)}
                  </span>
                </div>
                <div className="text-sm font-inter text-gray-600">
                  {formatDate(post.scheduledTime)}
                </div>
              </div>
              
              <div className="font-inter mb-4 line-clamp-2">
                {post.content}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-inter text-sm transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded font-inter text-sm transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 