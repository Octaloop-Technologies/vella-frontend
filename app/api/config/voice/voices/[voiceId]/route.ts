import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://ai-voice-agent-backend.octaloop.dev/api/v1';

interface RouteParams {
  params: Promise<{
    voiceId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { voiceId } = await params;
    
    console.log('Fetching voice details for:', voiceId);
    
    const response = await fetch(`https://ai-voice-agent-backend.octaloop.dev/voice/voices/${voiceId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Voice API error: ${response.status} - ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Failed to fetch voice details',
          message: errorData.message || `API Error: ${response.status} - ${response.statusText}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Voice API response for', voiceId, ':', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voice API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch voice details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}