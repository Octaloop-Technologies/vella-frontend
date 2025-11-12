import { ApiAgent } from './api';
import { AgentsTable } from '@/types/table';

// Transform API agent data to table format
export function transformApiAgentToTable(apiAgent: ApiAgent): AgentsTable {
  // Format agent type for display
  const formatAgentType = (type: string): string => {
    switch (type) {
      case 'inbound':
        return 'Inbound';
      case 'outbound':
        return 'Outbound';
      case 'widget':
        return 'Widget';
      default:
        return 'Unknown';
    }
  };

  // Get type variant for styling
  const getTypeVariant = (type: string): 'chat' | 'phone' | 'omnichannel' => {
    switch (type) {
      case 'chat_only':
        return 'chat';
      case 'phone_only':
        return 'phone';
      case 'omnichannel':
        return 'omnichannel';
      default:
        return 'chat';
    }
  };

  // Get status variant for styling
  const getStatusVariant = (status: string): 'active' | 'draft' | 'disabled' => {
    return status as 'active' | 'draft' | 'disabled';
  };

  // Format last active time
  const formatLastActive = (lastActive: string | null): string => {
    if (!lastActive) return 'Never';
    
    const now = new Date();
    const activeDate = new Date(lastActive);
    const diffMs = now.getTime() - activeDate.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return {
    id: apiAgent.id,
    name: apiAgent.name,
    type: formatAgentType(apiAgent.agent_type),
    typeVariant: getTypeVariant(apiAgent.channel_type),
    status: apiAgent.status.charAt(0).toUpperCase() + apiAgent.status.slice(1),
    statusVariant: getStatusVariant(apiAgent.status),
    conversations: apiAgent.conversations.toString(),
    successRate: `${apiAgent.success_rate}%`,
    lastActive: formatLastActive(apiAgent.last_active),
    description: apiAgent.description,
    language: apiAgent.language,
    gender: apiAgent.gender,
    persona: apiAgent.persona,
    createdAt: apiAgent.created_at,
    updatedAt: apiAgent.updated_at,
  };
}

// Transform multiple agents
export function transformApiAgentsToTable(apiAgents: ApiAgent[]): AgentsTable[] {
  return apiAgents.map(transformApiAgentToTable);
}