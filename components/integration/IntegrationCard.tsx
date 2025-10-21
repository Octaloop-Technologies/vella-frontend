import React, { ReactNode } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Image from 'next/image';

interface IntegrationCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    badges?: Array<{
        label: string;
        variant?: string;
    }>;
    connectedDate: string;
    lastSync: string;
    footerTags?: string[];
    isConnected?: boolean;
    onConnect?: () => void;
    onConfigure?: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
    icon,
    title,
    description,
    badges = [],
    connectedDate,
    lastSync,
    footerTags = [],
    isConnected,
    onConnect,
    onConfigure,
}) => {
    return (
        <Card className="border border-[#EBEBEB] p-4">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {icon}
                        <div className='flex flex-col'>
                            <h3 className="font-medium text-lg mb-1">{title}</h3>

                            <p className="text-xs opacity-70">{description}</p>

                        </div>
                    </div>
                </div>
            </div>

            {badges.length > 0 && (
                <div className="flex items-center space-x-2 mt-1 mb-4">
                    {badges.map((badge, index) => (
                        <Badge key={index} variant={badge.variant as any}>
                            {badge.label}
                        </Badge>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-xs opacity-70">Connected</span>
                    <span className="text-xs">{connectedDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-xs opacity-70">Last Sync</span>
                    <span className="text-xs">{lastSync}</span>
                </div>
            </div>

            {footerTags.length > 0 && (
                <div className="flex gap-2 mt-4">
                    {footerTags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="text-xs px-2.5 py-1 bg-[#FFFFFF1A] border border-[#EBEBEB] rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                    {footerTags.length > 3 && (
                        <span className="text-xs px-2.5 py-1 bg-[#FFFFFF1A] border border-[#EBEBEB] rounded-full">
                            +{footerTags.length - 3}
                        </span>
                    )}
                </div>
            )}
            {
                isConnected ? (
                    <div className='flex gap-3 mt-6'>
                    <button
                        onClick={onConfigure}
                        className="w-full px-4 py-2 border border-[#8266D4] font-medium rounded-md"
                    >
                        <Image src="/svgs/settings.svg" alt="Configure" width={24} height={24} className='inline-block mr-2'/>
                        Configure
                    </button>
                    <button className='bg-[#CF17421A] rounded-[10px] flex items-center justify-center p-4'>
                        <Image src="/svgs/cross.svg" alt="Disconnected" width={16} height={16} className='inline-block'/>
                    </button>
                    </div>

                ) : (
                    <button
                        onClick={onConnect}
                        className="mt-6 w-full px-4 py-2.5 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <span>Connect</span>
                    </button>
                )
            }
        </Card>
    );
};

export default IntegrationCard;
