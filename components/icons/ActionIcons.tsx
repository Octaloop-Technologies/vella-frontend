import React from 'react';
import { IconProps } from '@/types/sidebar';

export const WorkflowIcon: React.FC<IconProps> = ({ 
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
    <path d="M9 5v4H5V5h4m2-2H3v8h8V3zm8 8v4h-4v-4h4m2-2h-8v8h8v-8zM9 15v4H5v-4h4m2-2H3v8h8v-8z"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ 
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
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ 
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
    <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ 
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
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ 
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
    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
  </svg>
);