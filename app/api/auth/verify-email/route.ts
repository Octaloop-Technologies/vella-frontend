import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://ai-voice-agent-backend.octaloop.dev';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { detail: 'Token is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/auth/verify-email?token=${token}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: '', // Empty body as per curl
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { detail: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
