import React, { ReactNode } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { Dropdown, DropdownItem, DotsIcon } from '@/components/shared/Dropdown';

interface ItemCardProps {
  icon: ReactNode;
  title: string;
  description: string;
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
  description,
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
              <h3 className="font-semibold text-lg text-black">{title}</h3>
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
