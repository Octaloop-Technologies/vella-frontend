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
  const [isMounted, setIsMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 12rem = 192px
      const dropdownMaxHeight = 320; // max height for dropdown
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate horizontal position - position to the left of the button
      let left = rect.left - dropdownWidth + 24; // Offset to align near the dots

      // If it goes off the left edge, position to the right of button
      if (left < 8) {
        left = rect.right + 4;
      }

      // If it still goes off the right edge, align to right edge with padding
      if (left + dropdownWidth > viewportWidth - 8) {
        left = viewportWidth - dropdownWidth - 8;
      }

      // Calculate vertical position - align with top of button
      let top = rect.top;

      // Check if dropdown would go below viewport
      if (top + dropdownMaxHeight > viewportHeight - 8) {
        // Adjust to fit in viewport
        top = viewportHeight - dropdownMaxHeight - 8;
        
        // If it goes off top, position at top with padding
        if (top < 8) {
          top = 8;
        }
      }

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

      {isOpen && isMounted &&
        createPortal(
          <div
            ref={menuRef}
            className="w-48 bg-white rounded-lg shadow-xl border border-gray-200 origin-top-right transition-all duration-200 ease-out max-h-80 overflow-y-auto"
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 99999,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div className="py-1">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<{ closeDropdown?: () => void }>, {
                    closeDropdown: () => setIsOpen(false),
                  });
                }
                return child;
              })}
            </div>
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
      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
};