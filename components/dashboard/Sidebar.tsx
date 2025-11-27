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
        title="Sign out"
        subtitle="Are you sure you want to sign out?"
        showCloseButton={false}
        maxWidth="max-w-sm"
      >
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-6">You will be signed out of your account and returned to the login screen.</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSignoutOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsSignoutOpen(false);
                try {
                  await logout();
                } finally {
                  router.push('/login');
                }
              }}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
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