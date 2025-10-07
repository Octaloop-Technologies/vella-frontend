'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutIcon } from '@/components/icons';
import { SIDEBAR_ITEMS_CONFIG } from '@/constants/sidebar';
import { getIconComponent } from '@/utils/iconHelper';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-brand-white border-r border-brand-gray-light flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-brand-gray-light">
        <div className="flex items-center justify-center space-x-2">
         <Image src="/dashboard/png/logo.png" alt="Vella Logo" width={60} height={60} />
      
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {SIDEBAR_ITEMS_CONFIG.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = getIconComponent(item.iconName);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-brand-gray-light hover:text-brand-primary'
                    }
                  `}
                  style={isActive ? {
                    background: 'linear-gradient(180deg, #8266D4 0%, #41288A 100%)'
                  } : {}}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
                    <IconComponent />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-brand-gray-light">
        <button className="flex items-center space-x-3 px-3 py-2.5 w-full text-left rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50">
          <LogoutIcon />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;