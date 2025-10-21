import React from 'react';
import { IconProps } from '@/types/table';
import { createPortal } from 'react-dom';

export const DotsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <circle cx="2" cy="2" r="2" fill="black" />
      <circle cx="9" cy="2" r="2" fill="black" />
      <circle cx="16" cy="2" r="2" fill="black" />
    </g>
  </svg>
);

// Separate Reusable Dropdown Component
interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 12rem = 192px
      let left = rect.right - dropdownWidth;

      if (left < 0) {
        left = rect.left;
      }

      const top = rect.bottom + 4; // mt-1 ≈ 4px

      setPosition({ top, left });
    }
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      <button ref={triggerRef} onClick={handleToggle} className="p-1 rounded cursor-pointer">
        {trigger}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="w-48 bg-white rounded-lg shadow-lg border border-[#41288A80] z-[9999] origin-top-right transition-all duration-200 ease-out"
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: 'scale(1)',
              opacity: 1,
            }}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<{ closeDropdown?: () => void }>, {
                  closeDropdown: () => setIsOpen(false),
                });
              }
              return child;
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

export const DropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  closeDropdown?: () => void;
}> = ({ icon, label, onClick, className = '', closeDropdown }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (closeDropdown) closeDropdown();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] w-full text-left first:rounded-t-lg last:rounded-b-lg cursor-pointer hover:bg-[#F3F4F6] ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};