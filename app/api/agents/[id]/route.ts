import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://ai-voice-agent-backend.octaloop.dev';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BASE_URL}/agents/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch agent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BASE_URL}/agents/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update agent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BASE_URL}/agents/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete agent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}