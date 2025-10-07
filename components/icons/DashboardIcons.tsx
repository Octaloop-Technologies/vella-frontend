import React from 'react';
import { IconProps } from '@/types/sidebar';

export const DashboardIcon: React.FC<IconProps> = ({ 
  width = 20, 
  height = 20, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

export const AgentIcon: React.FC<IconProps> = ({ 
  width = 20, 
  height = 20, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export const KnowledgeIcon: React.FC<IconProps> = ({ 
  width = 20, 
  height = 20, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

export const IntegrationIcon: React.FC<IconProps> = ({ 
  width = 20, 
  height = 20, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);