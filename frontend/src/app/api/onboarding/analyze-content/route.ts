import { NextResponse } from 'next/server';

interface RequestBody {
  importMethod: 'text' | 'link';
  content: string;
  vocabularyList?: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    
    // Use the body variable in the response
    return NextResponse.json({
      brandVoice: `Based on your content: "${body.content}", your brand voice is friendly, professional, and approachable...`,
      vocabularyList: body.vocabularyList ? body.vocabularyList.split(',').map(word => word.trim()) : ['innovative', 'handcrafted', 'artisanal', 'premium', 'quality', 'authentic', 'sustainable'],
      tone: 'friendly',
      targetAudience: 'Local professionals aged 25-45 interested in specialty products and experiences',
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
} 