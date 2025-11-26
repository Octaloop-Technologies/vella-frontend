// Use Next.js API routes for server-side proxy
const BASE_URL = '/api';

export interface ApiAgent {
  id: string;
  name: string;
  description: string;
  agent_type: "inbound" | "outbound" | "widget";
  channel_type: 'omnichannel' | 'chat_only' | 'phone_only';

  language: string;
  gender: 'Male' | 'Female';
  persona: string;
  tune: string;
  voice_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  status: 'draft' | 'active' | 'disabled';
  conversations: number;
  success_rate: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
  model_id: string;
  phone_number?: string;
}

export interface AgentsResponse {
  agents: ApiAgent[];
  total: number;
  page: number;
  limit: number;
}

export interface AgentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const tokenType = typeof window !== 'undefined' ? (localStorage.getItem('token_type') || 'Bearer') : 'Bearer';
      
      const isFormData = options?.body instanceof FormData;
      const headers: HeadersInit = {
        'accept': 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options?.headers,
      };

      if (token) {
        (headers as any)['Authorization'] = `${tokenType} ${token}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Get all agents with pagination and filters
  async getAgents(params: AgentsParams = {}): Promise<AgentsResponse> {
    const { page = 1, limit = 10, search, status } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    if (status && status !== 'All Agents') {
      queryParams.append('status', status.toLowerCase());
    }

    return this.makeRequest<AgentsResponse>(`/agents/?${queryParams}`);
  }

  // Get single agent by ID
  async getAgentById(id: string): Promise<ApiAgent> {
    return this.makeRequest<ApiAgent>(`/agents/${id}`);
  }

  // Create new agent
  async createAgent(agentData: Partial<ApiAgent>): Promise<ApiAgent> {
    return this.makeRequest<ApiAgent>('/agents/', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  // Update agent
  async updateAgent(id: string, agentData: Partial<ApiAgent>): Promise<ApiAgent> {
    return this.makeRequest<ApiAgent>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  }

  // Delete agent
  async deleteAgent(id: string): Promise<void> {
    return this.makeRequest<void>(`/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // Knowledge Base Methods
  async getDocuments(params: { skip?: number; limit?: number } = {}): Promise<any> {
    const { skip = 0, limit = 100 } = params;
    return this.makeRequest(`/knowledge?skip=${skip}&limit=${limit}`);
  }

  async getDocumentById(id: string): Promise<any> {
    return this.makeRequest(`/knowledge/${id}`);
  }

  async deleteDocument(id: string): Promise<void> {
    return this.makeRequest(`/knowledge/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadDocument(formData: FormData): Promise<any> {
    return this.makeRequest('/knowledge/upload', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiService = new ApiService();