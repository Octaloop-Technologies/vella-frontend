import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://ai-voice-agent-backend.octaloop.dev';

interface RouteParams {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { path } = await params;
  
    const configPath = path.join('/');
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${BASE_URL}/config/${configPath}?${queryString}`
      : `${BASE_URL}/config/${configPath}`;
    
    console.log('Fetching configuration from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Config API error: ${response.status} - ${response.statusText}`, errorData);
      throw new Error(`External API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Config API response for', configPath, );
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Config API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}