import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://ai-voice-agent-backend.octaloop.dev/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Create a new FormData to send to the backend
    const backendFormData = new FormData();
    
    // Get all form fields
    const name = formData.get('name') as string;
    const documentType = formData.get('document_type') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;
    const tags = formData.get('tags') as string;

    // Append required fields
    if (name) backendFormData.append('name', name);
    if (documentType) backendFormData.append('document_type', documentType);
    if (content) backendFormData.append('content', content);
    if (tags) backendFormData.append('tags', tags);
    
    // Append file if present
    if (file) {
      backendFormData.append('file', file);
    }

    const response = await fetch(
      `${API_BASE_URL}/knowledge-base/documents`,
      {
        method: 'POST',
        body: backendFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to upload document', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
