'use client';

import { useState, useEffect } from 'react';

interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: string;
}

export default function SchedulingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
        setScheduledPosts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scheduled posts:', err);
        setError('Failed to load scheduled posts');
        setLoading(false);
      }
    };
    
    fetchScheduledPosts();
  }, [currentMonth]);
  
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-500';
      case 'instagram':
        return 'bg-pink-500';
      case 'linkedin':
        return 'bg-blue-700';
      case 'facebook':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getPostsForDay = (day: number | null) => {
    if (day === null) return [];
    
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return postDate.getDate() === day && 
             postDate.getMonth() === currentMonth.getMonth() && 
             postDate.getFullYear() === currentMonth.getFullYear();
    });
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-playfair mb-6">
        <span className="bg-[#F8C4A9] px-3 py-1 rounded-lg">Scheduling Calendar</span>
      </h1>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          &larr; Previous
        </button>
        
        <h2 className="text-xl font-playfair">{formatMonth(currentMonth)}</h2>
        
        <button 
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          Next &rarr;
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="font-inter text-gray-600">Loading calendar...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="font-inter text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center p-2 font-inter font-semibold">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              const postsForDay = getPostsForDay(day);
              const isToday = day === new Date().getDate() && 
                              currentMonth.getMonth() === new Date().getMonth() && 
                              currentMonth.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-24 p-1 border ${day ? 'border-gray-300' : 'border-transparent bg-gray-50'} ${isToday ? 'bg-blue-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className="text-right mb-1">
                        <span className={`inline-block rounded-full w-6 h-6 text-center ${isToday ? 'bg-blue-500 text-white' : ''}`}>
                          {day}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {postsForDay.map(post => (
                          <div 
                            key={post.id}
                            className={`p-1 rounded text-white text-xs truncate ${getPlatformColor(post.platform)}`}
                            title={post.content}
                          >
                            {post.content.slice(0, 18)}...
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
} 