'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SIDEBAR_ITEMS_CONFIG } from '@/constants/sidebar';
import { getIconComponent } from '@/utils/iconHelper';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import BaseModal from '../shared/BaseModal';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

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
             const isLogout = /sign\s*out|log\s*out|logout/i.test(item.label) || item.href === '/logout' || (item as any).action === 'logout';
            
            if (isLogout) {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setIsSignoutOpen(true)}
                    className={`
                      w-full flex items-center space-x-3 px-3 pl-6 py-2.5 rounded-[10px] transition-all duration-200 text-white text-left
                      ${isActive ? ' bg-[#FFFFFF33]' : ' text-gray-700'}
                    `}
                  >
                    <span className="text-white">
                      <IconComponent />
                    </span>
                    <span className="font-medium text-base">{item.label}</span>
                  </button>
                </li>
              );
            }

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
      {/* Sign out confirmation using BaseModal */}
      <BaseModal
        isOpen={isSignoutOpen}
        onClose={() => setIsSignoutOpen(false)}
        maxWidth="max-w-xl"
        showCloseButton={false}
      >
        <div className="p-10 pt-14 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-[#CF17421A] rounded-full flex items-center justify-center">
              <Image src="/svgs/trash.svg" alt="Sign out" width={24} height={24} />
            </div>
          </div>

          <h2 className="text-lg font-medium mb-3 text-black">Sign out</h2>
          <p className="text-xs opacity-70 mb-8 text-black">
            Are you sure you want to sign out? You will be returned to the login screen.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsSignoutOpen(false)}
              className="flex-1 px-6 py-3 border border-[#8266D4] text-[#8266D4] rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setIsSignoutOpen(false);
                try {
                  await logout();
                } finally {
                  router.push('/login');
                }
              }}
              className="flex-1 px-6 py-3 border border-[#CF1742] bg-[#CF17421A] text-[#CF1742] rounded-lg font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default Sidebar;