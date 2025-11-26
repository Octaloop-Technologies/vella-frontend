import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://ai-voice-agent-backend.octaloop.dev';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Missing Authorization header' },
        { status: 401 }
      );
    }

    // Assuming the endpoint is POST /ghl/disconnect based on typical patterns
    // If it's DELETE, we can change the method.
    const response = await fetch(`${BACKEND_URL}/ghl/disconnect`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GHL disconnect error:', error);
    return NextResponse.json(
      { detail: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
