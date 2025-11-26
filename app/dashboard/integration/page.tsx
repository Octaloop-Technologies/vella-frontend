"use client";

import { useState, useEffect } from 'react';
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
import { useToast } from '@/contexts/ToastContext';

interface Integration {
  id: string;
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
  onDisconnect?: () => void;
}

export default function Integration() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [ghlStatus, setGhlStatus] = useState<{ is_connected: boolean; connected_at?: string } | null>(null);

  useEffect(() => {
    fetchGHLStatus();
  }, []);

  const fetchGHLStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';
      
      const response = await fetch('/api/ghl/status', {
        headers: {
          'Authorization': `${tokenType} ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGhlStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch GHL status', error);
    }
  };

  const handleGHLConnect = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      const response = await fetch('/api/ghl/auth-url', {
        headers: {
          'Authorization': `${tokenType} ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        addToast({ message: "Failed to get authorization URL", type: "error" });
      }
    } catch (error) {
      addToast({ message: "Something went wrong", type: "error" });
    }
  };

  const handleGHLDisconnect = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      const response = await fetch('/api/ghl/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${token}`,
        },
      });

      if (response.ok) {
        addToast({ message: "Disconnected successfully", type: "success" });
        setGhlStatus({ is_connected: false });
      } else {
        addToast({ message: "Failed to disconnect", type: "error" });
      }
    } catch (error) {
      addToast({ message: "Something went wrong", type: "error" });
    }
  };

  const statsCards = [
    {
      title: "Total Integrations",
      value: "5",
    },
    {
      title: "Connected",
      value: ghlStatus?.is_connected ? "1" : "0",
    },
    {
      title: "Pending",
      value: "0",
    },
    {
      title: "Available",
      value: ghlStatus?.is_connected ? "4" : "5",
    },
  ];

  const integrationsData: Integration[] = [
    {
      id: 'ghl',
      name: 'GoHighLevel',
      description: 'All-in-one sales & marketing platform',
      icon: (
        <div className="w-16 h-16 bg-[#1877F21A] rounded-xl flex items-center justify-center">
           {/* Placeholder for GHL Icon, using text or a generic icon if image not available */}
           <span className="text-[#1877F2] font-bold text-xs">GHL</span>
        </div>
      ),
      badges: ghlStatus?.is_connected 
        ? [{ label: "Connected", variant: "connected" }, { label: "CRM", variant: "popular" }]
        : [{ label: "Not Connected", variant: "notConnected" }, { label: "CRM", variant: "popular" }],
      connectedDate: ghlStatus?.connected_at ? new Date(ghlStatus.connected_at).toLocaleDateString() : undefined,
      lastSync: ghlStatus?.is_connected ? 'Just now' : undefined,
      footerTags: ['Contact Sync', 'Calendar', 'Opportunities'],
      isConnected: ghlStatus?.is_connected || false,
      onConnect: handleGHLConnect,
      onConfigure: () => console.log('Configure GHL'),
      onDisconnect: handleGHLDisconnect,
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#FF7B571A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/hubspot.svg" alt="HubSpot" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Not Connected", variant: "notConnected" }, { label: "Popular", variant: "popular" }],
      connectedDate: undefined,
      lastSync: undefined,
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: false,
      onConnect: () => handleConnect(integrationsData[1]),
      onConfigure: () => handleConfigure(integrationsData[1]),
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#6B4FBE1A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/messenger.svg" alt="Messenger" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Not Connected", variant: "notConnected" }, { label: "Popular", variant: "popular" }],
      connectedDate: undefined,
      lastSync: undefined,
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking', 'Lead Management'],
      isConnected: false,
      onConnect: () => handleConnect(integrationsData[2]),
      onConfigure: () => handleConfigure(integrationsData[2]),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#07BA391A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/whatsapp.svg" alt="WhatsApp" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Not Connected", variant: "notConnected" }, { label: "Popular", variant: "popular" }],
      connectedDate: undefined,
      lastSync: undefined,
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: false,
      onConnect: () => handleConnect(integrationsData[3]),
      onConfigure: () => handleConfigure(integrationsData[3]),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-16 h-16 bg-[#FF76441A] rounded-xl flex items-center justify-center">
          <Image src="/svgs/instagram.svg" alt="Instagram" width={42} height={42} />
        </div>
      ),
      badges: [{ label: "Not Connected", variant: "notConnected" }, { label: "Popular", variant: "popular" }],
      connectedDate: undefined,
      lastSync: undefined,
      footerTags: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      isConnected: false,
      onConnect: () => handleConnect(integrationsData[4]),
      onConfigure: () => handleConfigure(integrationsData[4]),
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
              onDisconnect={integration.onDisconnect}
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