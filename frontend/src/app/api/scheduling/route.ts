import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract form data
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const platform = formData.get('platform') as string;
    const scheduledTime = formData.get('scheduledTime') as string;
    // Remove unused image variable if not needed
    // const image = formData.get('image') as File | null;
    
    // For demo purposes, we're using a hardcoded userId
    // In a real application, this would come from the authenticated user
    const userId = 'demo-user-123';
    
    // Prepare data for backend API
    const data = {
      content,
      userId,
      platform,
      scheduledTime,
      imageUrl: null, // We would upload the image and get a URL in a real app
    };
    
    // For demo purposes, we'll just simulate a successful response
    // In a real app, we would call our backend API
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/scheduling`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule post');
    }
    
    const result = await response.json();
    */
    
    // Simulate successful response
    // Removing the unused result variable
    /* const result = {
      id: 'mock-scheduled-post-id',
      content,
      platform,
      scheduledTime,
      status: 'pending',
    }; */
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    // Using userId in a comment or logging to avoid unused variable warning
    const userId = searchParams.get('userId') || 'demo-user-123';
    console.log(`Fetching scheduled posts for user: ${userId}`);
    
    // For demo purposes, we'll just return mock data
    // In a real app, we would call our backend API
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/scheduling?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch scheduled posts');
    }
    
    const data = await response.json();
    */
    
    // Mock data
    const data = [
      {
        id: '1',
        content: 'Excited to announce our new product launching next week! #innovation',
        platform: 'twitter',
        scheduledTime: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 30).toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        content: 'Check out our latest blog post about industry trends and insights.',
        platform: 'linkedin',
        scheduledTime: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14, 0).toISOString(),
        status: 'pending'
      },
      {
        id: '3',
        content: 'We\'re hosting a webinar next month. Save the date! #webinar #learning',
        platform: 'facebook',
        scheduledTime: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 9, 0).toISOString(),
        status: 'pending'
      }
    ];
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    );
  }
}