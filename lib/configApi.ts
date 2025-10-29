import { apiService } from './api';

// Configuration API Types
export interface AgentTypeConfig {
  name: string;
  description: string;
  features: string[];
  channels: string[];
  use_cases: string[];
}

export interface AgentTypesResponse {
  phone_only: AgentTypeConfig;
  chat_only: AgentTypeConfig;
  omnichannel: AgentTypeConfig;
}

export interface Language {
  code: string;
  name: string;
  voice_count: number;
}

export interface Gender {
  code: string;
  name: string;
  voice_count: number;
}

export interface Voice {
  name: string;
  voice_id: string;
  gender: string;
  description: string;
  preview_url: string;
}

export interface Accent {
  code: string;
  name: string;
  voice_count: number;
  gender: string;
  all_voices: Voice[];
}

export interface Persona {
  code: string;
  name: string;
  description: string;
  voice_id: string;
  accent: string;
  metadata: {
    gender: string;
    accent: string;
    age: string;
    use_case: string;
    descriptive: string;
    language: string;
  };
}

export interface SampleVoice {
  name: string;
  voice_id: string;
}

export interface Tune {
  code: string;
  name: string;
  description: string;
  type: string;
  voice_count: number;
  sample_voices: SampleVoice[];
}

export interface CreateAgentRequest {
  name: string;
  description: string;
  agent_type: 'phone_only' | 'chat_only' | 'omnichannel';
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
  model_id: string;
}

export interface CreateAgentResponse {
  id: string;
  name: string;
  description: string;
  agent_type: 'phone_only' | 'chat_only' | 'omnichannel';
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
  status: string;
  conversations: number;
  success_rate: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
  model_id: string;
}

export interface VoiceDetailsResponse {
  success: boolean;
  voice: {
    voice_id: string;
    name: string;
    description: string;
    preview_url: string;
    labels: {
      accent: string;
      descriptive: string;
      age: string;
      gender: string;
      language: string;
      use_case: string;
    };
    settings: {
      stability: number;
      use_speaker_boost: boolean;
      similarity_boost: number;
      style: number;
      speed: number;
    };
  };
}

class ConfigService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`/api/config/${endpoint}`, {
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Config API Request failed:', error);
      throw error;
    }
  }

  // Get agent types configuration
  async getAgentTypes(): Promise<AgentTypesResponse> {
    return this.makeRequest<AgentTypesResponse>('agent-types');
  }

  // Get available languages
  async getLanguages(): Promise<Language[]> {
    return this.makeRequest<Language[]>('languages');
  }

  // Get available genders
  async getGenders(): Promise<Gender[]> {
    return this.makeRequest<Gender[]>('genders');
  }

  // Get personas by gender
  async getPersonasByGender(gender: string): Promise<Persona[]> {
    return this.makeRequest<Persona[]>(`personas/by-gender/${gender}`);
  }

  // Get accents by gender
  async getAccentsByGender(gender: string): Promise<Accent[]> {
    return this.makeRequest<Accent[]>(`accents/by-gender/${gender}`);
  }

  // Get personas by accent and gender
  async getPersonasByAccent(accent: string, gender: string): Promise<Persona[]> {
    return this.makeRequest<Persona[]>(`personas/by-accent/${accent}?gender=${gender}`);
  }

  // Get available tunes
  async getTunes(): Promise<Tune[]> {
    return this.makeRequest<Tune[]>('tunes');
  }

  // Get voice details by voice ID
  async getVoiceDetails(voiceId: string): Promise<VoiceDetailsResponse> {
    return this.makeRequest<VoiceDetailsResponse>(`voice/voices/${voiceId}`);
  }

  // Create new agent
  async createAgent(agentData: CreateAgentRequest): Promise<CreateAgentResponse> {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create Agent API Request failed:', error);
      throw error;
    }
  }
}

export const configService = new ConfigService();