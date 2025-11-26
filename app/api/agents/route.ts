import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://ai-voice-agent-backend.octaloop.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build query parameters for the external API
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append('search', search);
    }

    if (status && status !== 'All Agents') {
      queryParams.append('status', status.toLowerCase());
    }

    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Make request to external API
    const response = await fetch(`${BASE_URL}/agents/?${queryParams}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`External API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch agents',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body for new agent:', JSON.stringify(body, null, 2));
    // Map frontend field names to backend API field names
    const apiPayload = {
      name: body.agentName || body.name,
      description: body.description,
      agent_type: body.agentTypeDropdown || body.agent_type || body.agentType,
      language: body.language,
      gender: body.gender,
      persona: body.persona,
      voice_id: body.voiceId || body.voice_id,
      tune: body.tune,
      voice_settings:"",
      ...body
    };

    // Remove frontend-specific fields that aren't needed by the API
    delete apiPayload.agentName;
    delete apiPayload.agentTypeDropdown;
    delete apiPayload.agentType;
    delete apiPayload.voiceId;
    
    console.log('Sending to API:', JSON.stringify(apiPayload, null, 2));
    
    // Convert to form data format (application/x-www-form-urlencoded)
    const formData = new URLSearchParams();
    Object.entries(apiPayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Special handling for arrays - append each item separately
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach(item => {
              if (item !== null && item !== undefined) {
                formData.append(key, String(item));
              }
            });
          }
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${BASE_URL}/agents/`, {
      method: 'POST',
      headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`External API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create agent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}