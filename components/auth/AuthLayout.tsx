import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Large purple gradient circle - bottom left */}
      <div className="absolute -bottom-[10px] -left-[220px] w-[440px] h-[440px] rounded-full bg-gradient-to-b from-[#997CEB] to-[#41288A] opacity-90"></div>

      {/* Small purple gradient circle - bottom left */}
      <div className="absolute bottom-[380px] -left-[51px] w-[140px] h-[140px] rounded-full bg-gradient-to-b from-[#997CEB] to-[#41288A]"></div>
      
      {/* Large purple gradient circle - top right */}
      <div className="absolute -top-9 -right-72 w-[440px] h-[440px] rounded-full bg-gradient-to-b from-[#997CEB] to-[#41288A] opacity-90"></div>
      
      {/* Content card */}
      <div className="relative z-10 w-full max-w-[480px] mx-4">
        <div className="px-8 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-7">
            <Image
              src="/dashboard/png/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
