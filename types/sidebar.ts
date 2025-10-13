export interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  gradient?: { from: string; to: string };
  className?: string;
}