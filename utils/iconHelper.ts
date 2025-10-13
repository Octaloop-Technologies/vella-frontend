import {
  DashboardIcon,
  AgentIcon,
  KnowledgeIcon,
  IntegrationIcon,
  WorkflowIcon,
  ChatIcon,
  HistoryIcon,
  SettingsIcon,
  LogoutIcon,
} from '@/components/icons';

export const getIconComponent = (iconName: string) => {
  const iconMap = {
    dashboard: DashboardIcon,
    agent: AgentIcon,
    knowledge: KnowledgeIcon,
    integration: IntegrationIcon,
    workflow: WorkflowIcon,
    chat: ChatIcon,
    history: HistoryIcon,
    settings: SettingsIcon,
    logout: LogoutIcon,
  };
  
  return iconMap[iconName as keyof typeof iconMap] || DashboardIcon;
};