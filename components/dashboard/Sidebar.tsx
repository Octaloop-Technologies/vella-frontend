'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_ITEMS_CONFIG } from '@/constants/sidebar';
import { getIconComponent } from '@/utils/iconHelper';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-60 h-screen primary-gradient border-r border-brand-gray-light flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center justify-center space-x-2">
         <Image src="/dashboard/png/dash-new2.png" alt="Vella Logo" width={180} height={120} />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {SIDEBAR_ITEMS_CONFIG.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = getIconComponent(item.iconName);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 pl-6 py-2.5 rounded-[10px] transition-all duration-200 text-white
                    ${isActive 
                      ? ' bg-[#FFFFFF33]' 
                      : ' text-gray-700'
                    }
                  `}
                >
                  <span className={`text-white`}>
                    <IconComponent />
                  </span>
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;