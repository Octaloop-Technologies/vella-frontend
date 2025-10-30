/**
 * Widget API - Start Conversation
 * Proxies conversation start requests from widgets to the main backend
 */

export async function POST(
  request: Request,
 context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;
    const url = new URL(request.url);
    const channel = url.searchParams.get('channel') || 'widget';

    // Forward to your main backend
    const backendUrl = process.env.BACKEND_URL || 'https://ai-voice-agent-backend.octaloop.dev';
    
    const response = await fetch(`${backendUrl}/conversations/start/${agentId}?channel=${channel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
        // 'Authorization': `Bearer ${process.env.API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Widget conversation start error:', error);
     
    return Response.json(
      { 
        error: 'Failed to start conversation',
        message: 'Unable to connect to the AI service. Please try again later.'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}