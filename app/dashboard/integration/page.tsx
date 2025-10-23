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
import FilterDropdown from '@/components/shared/FilterDropdown';

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
              <FilterDropdown
                isOpen={isCategoryDropdownOpen}
                setIsOpen={setIsCategoryDropdownOpen}
                value={filterCategory}
                setValue={setFilterCategory}
                options={['All Categories', 'CRM', 'Messaging', 'Social Media', 'Marketing']}
              />
            </div>

            <div className="relative w-[15%]">
              <FilterDropdown
                isOpen={isStatusDropdownOpen}
                setIsOpen={setIsStatusDropdownOpen}
                value={filterStatus}
                setValue={setFilterStatus}
                options={['All Status', 'Connected', 'Not Connected']}
              />
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