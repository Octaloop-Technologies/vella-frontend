"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import SearchIcon from '@/components/icons/SearchIcon';
import ConnectIntegrationModal from '@/components/integration/ConnectIntegrationModal';
import SuccessModal from '@/components/integration/SuccessModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not-connected';
  badge: 'Popular' | 'New' | 'Premium' | null;
  connectedDate?: string;
  lastSync?: string;
  features: string[];
  additionalInfo?: Record<string, string>;
}

// Integration Card Component
const IntegrationCard = ({ 
  integration,
  onConnect,
  onConfigure
}: { 
  integration: Integration;
  onConnect: () => void;
  onConfigure: () => void;
}) => {
  const isConnected = integration.status === 'connected';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {integration.icon}
          <div>
            <h3 className="font-semibold text-[#1F2937] text-base">{integration.name}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{integration.description}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {isConnected ? (
          <span className="inline-block text-xs px-3 py-1 rounded-full font-medium bg-[#D1FAE5] text-[#059669]">
            Connected
          </span>
        ) : (
          <span className="inline-block text-xs px-3 py-1 rounded-full font-medium bg-[#FEE2E2] text-[#DC2626]">
            Not Connected
          </span>
        )}
        {integration.badge && (
          <span className="inline-block text-xs px-3 py-1 rounded-full font-medium bg-[#EEF2FF] text-[#8266D4]">
            {integration.badge}
          </span>
        )}
      </div>

      {isConnected && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Connected</span>
            <span className="font-medium text-[#1F2937]">{integration.connectedDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Last sync</span>
            <span className="font-medium text-[#1F2937]">{integration.lastSync}</span>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {integration.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-[#6B7280]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
              <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" fill="none"/>
            </svg>
            {feature}
          </div>
        ))}
      </div>

      {integration.additionalInfo && (
        <div className="space-y-2 mb-4">
          {Object.entries(integration.additionalInfo).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">{key}</span>
              <span className="font-medium text-[#1F2937]">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={isConnected ? onConfigure : onConnect}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isConnected
              ? 'border border-[#41288A] text-[#41288A] hover:bg-[#F3F0FF]'
              : 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white hover:opacity-90'
          }`}
        >
          {isConnected ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
              </svg>
              Configure
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Connect
            </>
          )}
        </button>
        {isConnected && (
          <button className="p-2.5 border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-[#FEE2E2] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default function Integration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrationsData: Integration[] = [
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-12 h-12 bg-[#FF7A59] rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M18.5 11c-.3 0-.5.2-.5.5v1c0 2.5-2 4.5-4.5 4.5S9 14.5 9 12V6.5c0-.3-.2-.5-.5-.5S8 6.2 8 6.5V12c0 2.8 2 5.2 4.7 5.7v1.8c0 .3.2.5.5.5s.5-.2.5-.5v-1.8c2.7-.5 4.7-2.9 4.7-5.7v-1c0-.3-.2-.5-.5-.5zM13.5 15c1.9 0 3.5-1.6 3.5-3.5v-5c0-1.9-1.6-3.5-3.5-3.5S10 4.6 10 6.5v5c0 1.9 1.6 3.5 3.5 3.5z"/>
          </svg>
        </div>
      ),
      status: 'connected',
      badge: 'Popular',
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      features: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      additionalInfo: {
        'Activity Tracking': '+1'
      }
    },
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-12 h-12 bg-[#0084FF] rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.9 1.45 5.48 3.7 7.2V22l3.4-1.87c.9.25 1.85.37 2.9.37 5.5 0 10-4.14 10-9.25S17.5 2 12 2zm1 12.5l-2.5-2.67-4.9 2.67 5.4-5.73 2.56 2.67 4.84-2.67-5.4 5.73z"/>
          </svg>
        </div>
      ),
      status: 'not-connected',
      badge: 'Popular',
      features: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      additionalInfo: {
        'Activity Tracking': '+1'
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      ),
      status: 'connected',
      badge: 'Popular',
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      features: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      additionalInfo: {
        'Activity Tracking': '+1'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </div>
      ),
      status: 'connected',
      badge: 'Popular',
      connectedDate: '2025/01/15',
      lastSync: '2 minutes ago',
      features: ['Contact Sync', 'Deal Management', 'Activity Tracking'],
      additionalInfo: {
        'Activity Tracking': '+1'
      }
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Frequently asked questions about our product features',
      icon: (
        <div className="w-12 h-12 bg-[#00A1E0] rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M10.006 5.413a4.142 4.142 0 013.685-2.258c1.73 0 3.226.985 3.95 2.426a5.027 5.027 0 011.303-.174c2.767 0 5.011 2.243 5.011 5.01 0 .406-.05.801-.144 1.176 1.305.755 2.189 2.161 2.189 3.778 0 2.42-1.961 4.381-4.382 4.381-.276 0-.545-.026-.807-.075a4.382 4.382 0 01-8.218 0 5.013 5.013 0 01-.807.075c-2.42 0-4.382-1.961-4.382-4.381 0-1.617.884-3.023 2.189-3.778a5.013 5.013 0 01-.144-1.176c0-2.767 2.244-5.01 5.011-5.01.446 0 .88.059 1.303.174a4.142 4.142 0 01-.757-2.168z"/>
          </svg>
        </div>
      ),
      status: 'not-connected',
      badge: null,
      features: ['Lead Management', 'Opportunity Tracking', 'Account Management', 'Reports']
    },
  ];

  const filteredData = integrationsData.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories'; // Add category filtering logic
    const matchesStatus = filterStatus === 'All Status' || 
      (filterStatus === 'Connected' && integration.status === 'connected') ||
      (filterStatus === 'Not Connected' && integration.status === 'not-connected');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalIntegrations = integrationsData.length;
  const connectedCount = integrationsData.filter(i => i.status === 'connected').length;
  const pendingCount = 1; // Adjust based on your logic
  const availableCount = integrationsData.filter(i => i.status === 'not-connected').length;

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
              <h1 className="text-2xl font-semibold text-black">Integrations</h1>
              <p className="text-[#6B7280] mt-1 text-sm">Connect your favorite tools and platforms</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#8266D4">
                    <path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm-6 9v-2h16v2H4z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Total Integrations</p>
                  <p className="text-2xl font-semibold text-black">{totalIntegrations}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#059669">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Connected</p>
                  <p className="text-2xl font-semibold text-black">{connectedCount}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#D97706">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Pending</p>
                  <p className="text-2xl font-semibold text-black">{pendingCount}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7280">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Available</p>
                  <p className="text-2xl font-semibold text-black">{availableCount}</p>
                </div>
              </div>
            </Card>
          </div>

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
                className="px-5 py-3 border border-[#D1D5DB] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
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
                className="px-5 py-3 border border-[#D1D5DB] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
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
          {filteredData.map((integration) => (
            <IntegrationCard 
              key={integration.id} 
              integration={integration}
              onConnect={() => handleConnect(integration)}
              onConfigure={() => handleConfigure(integration)}
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