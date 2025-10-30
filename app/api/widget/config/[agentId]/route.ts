/**
 * Widget Config API
 * Returns agent configuration for widget initialization
 */

export async function GET(
  request: Request,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    // You can fetch agent details from your database here
    // For now, returning a basic config that works with your existing agent data
    
    const agentConfig = {
      agentId: agentId,
      name: 'AI Assistant',
      description: 'I can help you with questions',
      theme: 'light',
      primaryColor: '#8266D4',
      isActive: true,
      features: {
        typing: true,
        fileUpload: false,
        voiceMessages: false
      }
    };

    return Response.json(agentConfig, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Widget config error:', error);
    
    return Response.json(
      { error: 'Failed to fetch agent configuration' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}