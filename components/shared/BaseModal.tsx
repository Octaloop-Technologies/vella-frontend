'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-5xl',
  showCloseButton = true,
  className = '',
  title,
  subtitle,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-[20px] shadow-xl ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {
          (title || subtitle || showCloseButton) &&
          <div className='px-3 pt-6 pb-4 border-b border-[#0000001A]'>
            {title && <h2 className="text-lg font-medium mb-1">{title}</h2>}
            {subtitle && <p className="text-xs font-medium opacity-70">{subtitle}</p>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-8 right-6 w-6 h-6 flex items-center justify-center rounded-full bg-[#CF1742] transition-colors z-10 cursor-pointer"
              >
                <Image src="/svgs/cross2.svg" alt="Close" width={10} height={10} />
              </button>
            )}
          </div>
        }
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
