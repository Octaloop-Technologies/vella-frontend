import React from "react";
import Image from "next/image";
import Input from "@/components/shared/Input";
import SearchIcon from "@/components/icons/SearchIcon";
import { useAuth } from "@/contexts/AuthContext";

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.68792 9.84632C1.54615 10.7757 2.17997 11.4207 2.956 11.7422C5.93118 12.9747 10.0714 12.9747 13.0466 11.7422C13.8226 11.4207 14.4564 10.7757 14.3147 9.84632C14.2276 9.27518 13.7968 8.79958 13.4776 8.33518C13.0595 7.71945 13.018 7.04778 13.0179 6.33325C13.0179 3.57183 10.7719 1.33325 8.0013 1.33325C5.23072 1.33325 2.98472 3.57183 2.98472 6.33325C2.98466 7.04778 2.94312 7.71945 2.52504 8.33518C2.20586 8.79958 1.77504 9.27518 1.68792 9.84632Z" stroke="black" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.33203 12.6667C5.63769 13.8169 6.7157 14.6667 7.9987 14.6667C9.2817 14.6667 10.3597 13.8169 10.6654 12.6667" stroke="black" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface DashboardHeaderProps {
  // Removed title and subtitle props since we're not using them anymore
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const { user } = useAuth();

  return (
    <header className="bg-brand-white border-b border-brand-gray-light px-6 py-4">
      <div className="flex items-center justify-between">
        <Input containerClassName="w-1/3" type="text" placeholder="Search agents, docs, chats..." icon={<SearchIcon />} />
        {/* Right side - Notification and User */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button className="p-2 text-gray-500 bg-[#D9D9D94D] rounded-full">
            <NotificationIcon />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Image
              src="/dashboard/png/user-avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full border border-[#F7F6F9]"
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-brand-black">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#ADADAD]">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
