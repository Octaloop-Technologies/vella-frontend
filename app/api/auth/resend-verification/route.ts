import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://ai-voice-agent-backend.octaloop.dev';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { detail: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
