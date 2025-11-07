export interface SidebarItemConfig {
  iconName: string;
  label: string;
  href: string;
}
// new 

export const SIDEBAR_ITEMS_CONFIG: SidebarItemConfig[] = [
  {
    iconName: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    iconName: 'agent',
    label: 'Agent',
    href: '/dashboard/agent',
  },
  {
    iconName: 'knowledge',
    label: 'Knowledge Base',
    href: '/dashboard/knowledge',
  },
  {
    iconName: 'integration',
    label: 'Integration',
    href: '/dashboard/integration',
  },
  {
    iconName: 'workflow',
    label: 'Workflows',
    href: '/dashboard/workflows',
  },
  {
    iconName: 'chat',
    label: 'Chat',
    href: '/dashboard/chat',
  },
  {
    iconName: 'history',
    label: 'History',
    href: '/dashboard/history',
  },
  {
    iconName: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
  },
  {
    iconName: 'logout',
    label: 'Log Out',
    href: '/login',
  },
];