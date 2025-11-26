import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://ai-voice-agent-backend.octaloop.dev';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Missing Authorization header' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/ghl/connect`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GHL connect error:', error);
    return NextResponse.json(
      { detail: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
