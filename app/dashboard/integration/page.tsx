"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import SearchIcon from '@/components/icons/SearchIcon';
import ConnectIntegrationModal from '@/components/integration/ConnectIntegrationModal';
import SuccessModal from '@/components/integration/SuccessModal';
import StatsCard from '@/components/shared/StatsCard';
import Image from 'next/image';
import IntegrationCard from '@/components/integration/IntegrationCard';

interface Integration {
  name: string;
  description: string;
  icon: React.ReactNode;
  badges: Array<{
    label: string;
    variant?: string;
  }>;
  connectedDate?: string;
  lastSync?: string;
  footerTags: string[];
  isConnected?: boolean;
  onConnect?: () => void;
  onConfigure?: () => void;
}

export default function Integration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const statsCards = [
    {
      title: "Total Integrations",
      value: "5",
    },
    {
      title: "Connected",
      value: "2",
    },
    {
      title: "Pending",
      value: "1",
    },
    {
      title: "Available",
      value: "1",
    },
  ];

  const integrationsData: Integration[] = [
    {
      name: 'HubSpot',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#FF7B571A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/hubspot.svg" alt="HubSpot" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Connected", variant: "connected" }, { label: "Popular", variant: "popular" }],
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: true,
      onConnect: () => handleConnect(integrationsData[0]),
      onConfigure: () => handleConfigure(integrationsData[0]),
    },
    {
      name: 'Facebook Messenger',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#6B4FBE1A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/messenger.svg" alt="Messenger" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Not Connected", variant: "notConnected" }, { label: "Popular", variant: "popular" }],
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking', 'Lead Management'],
      isConnected: false,
      onConnect: () => handleConnect(integrationsData[1]),
      onConfigure: () => handleConfigure(integrationsData[1]),
    },
    {
      name: 'WhatsApp Business',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#07BA391A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/whatsapp.svg" alt="WhatsApp" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Connected", variant: "connected" }, { label: "Popular", variant: "popular" }],
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: true,
      onConnect: () => handleConnect(integrationsData[2]),
      onConfigure: () => handleConfigure(integrationsData[2]),
    },
    {
      name: 'Instagram',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#FF76441A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/instagram.svg" alt="Instagram" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Connected", variant: "connected" }, { label: "Popular", variant: "popular" }],
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: true,
      onConnect: () => handleConnect(integrationsData[3]),
      onConfigure: () => handleConfigure(integrationsData[3]),
    },
  ];

  const filteredData = integrationsData.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories'; // Add category filtering logic
    const matchesStatus = filterStatus === 'All Status' ||
      (filterStatus === 'Connected' && integration.isConnected) ||
      (filterStatus === 'Not Connected' && !integration.isConnected);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConnectModalOpen(true);
  };

  const handleConnectSuccess = () => {
    setIsConnectModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleConfigure = (integration: Integration) => {
    // Handle configuration logic
    console.log('Configure:', integration.name);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-black">Integrations</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Connect your favorite tools and platforms</p>
            </div>
          </div>

          {/* Stats Cards */}
          <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 py-6'>
            {
              statsCards.map((card) => (
                <StatsCard key={card.title} {...card} />
              ))
            }
          </Card>

          {/* Search and Filter Bar */}
          <Card className="flex items-center gap-4 px-8 py-6">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search integration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
                icon={<SearchIcon />}
              />
            </div>

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="px-5 py-3  border border-[#41288A80] bg-white rounded-lg text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterCategory}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Categories', 'CRM', 'Messaging', 'Social Media', 'Marketing'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterCategory(option);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterCategory === option ? 'bg-[#EEF2FF]' : ''}`}
                      >
                        <span className={filterCategory === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                          {option}
                        </span>
                        {filterCategory === option && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#8266D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="px-5 py-3  border border-[#41288A80] bg-white rounded-lg text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterStatus}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Status', 'Connected', 'Not Connected'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterStatus(option);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterStatus === option ? 'bg-[#EEF2FF]' : ''}`}
                      >
                        <span className={filterStatus === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                          {option}
                        </span>
                        {filterStatus === option && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#8266D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((integration, index) => (
            <IntegrationCard
              key={index}
              icon={integration.icon}
              title={integration.name}
              description={integration.description}
              badges={integration.badges}
              connectedDate={integration.connectedDate || ''}
              lastSync={integration.lastSync || ''}
              footerTags={integration.footerTags}
              isConnected={integration.isConnected}
              onConnect={integration.onConnect}
              onConfigure={integration.onConfigure}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <ConnectIntegrationModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        integration={selectedIntegration}
        onSuccess={handleConnectSuccess}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        integrationName={selectedIntegration?.name || ''}
      />
    </DashboardLayout>
  );
}