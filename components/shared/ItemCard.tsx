import React, { ReactNode } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { Dropdown, DropdownItem, DotsIcon } from '@/components/shared/Dropdown';

interface ItemCardProps {
  icon: ReactNode;
  title: string;
  onTitleClick?: () => void;
  description: string;
  phoneNumber?: string | null;
  badges?: Array<{
    label: string;
    variant?: string;
  }>;
  stats: Array<{
    label: string;
    value: string;
  }>;
  footerTags?: string[];
  menuItems?: Array<{
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
  }>;
}

const ItemCard: React.FC<ItemCardProps> = ({
  icon,
  title,
  onTitleClick,
  description,
  phoneNumber,
  badges = [],
  stats,
  footerTags = [],
  menuItems = []
}) => {
  return (
    <Card className="border border-[#EBEBEB] p-4">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <h3 
                className={`font-semibold text-lg text-black ${onTitleClick ? 'cursor-pointer hover:text-[#8266D4] transition-colors' : ''}`}
                onClick={onTitleClick}
              >
                {title}
              </h3>
              {badges.length > 0 && (
                <div className="flex items-center space-x-2 mt-1">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant={badge.variant as any}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {menuItems.length > 0 && (
            <div className="relative group">
              <Dropdown trigger={<DotsIcon />}>
                {menuItems.map((item, index) => (
                  <DropdownItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onClick={item.onClick}
                    className={item.className}
                  />
                ))}
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-black mb-4 font-medium">{description}</p>
      
      {phoneNumber && phoneNumber !== 'null' && phoneNumber !== 'undefined' && (
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#8266D4]/10 to-[#41288A]/10 px-3 py-1.5 rounded-lg border border-[#8266D4]/20">
            <svg 
              className="w-3.5 h-3.5 text-[#8266D4]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            <span className="text-xs font-medium text-[#8266D4]">
              {phoneNumber}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-xs opacity-70 text-black">{stat.label}</span>
            <span className="text-xs text-black">{stat.value}</span>
          </div>
        ))}
      </div>

      {footerTags.length > 0 && (
        <div className="flex gap-2 mt-4">
          {footerTags.map((tag, index) => (
            <span key={index} className="text-xs px-2.5 py-1 bg-[#FFFFFF1A] border border-[#EBEBEB] rounded-full text-black">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ItemCard;
