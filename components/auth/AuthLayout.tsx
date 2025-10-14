import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Large purple gradient circle - bottom left */}
      <div className="absolute -bottom-[40%] -left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8266D4] to-[#41288A] opacity-90"></div>
      
      {/* Large purple gradient circle - top right */}
      <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#8266D4] to-[#41288A] opacity-90"></div>
      
      {/* Content card */}
      <div className="relative z-10 w-full max-w-[480px] mx-4">
        <div className="px-8 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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
