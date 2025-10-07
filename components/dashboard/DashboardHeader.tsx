import React from "react";
import Image from "next/image";

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const NotificationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

interface DashboardHeaderProps {
  // Removed title and subtitle props since we're not using them anymore
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <header className="bg-brand-white border-b border-brand-gray-light px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search agents, docs, chats..."
            className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* Right side - Notification and User */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-gray-light rounded-lg transition-colors">
            <NotificationIcon />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AA</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-brand-black">Anas Ali</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
