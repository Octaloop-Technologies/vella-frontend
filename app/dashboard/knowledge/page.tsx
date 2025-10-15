"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { Document } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import ListViewIcon from '@/components/icons/ListViewIcon';
import CardViewIcon from '@/components/icons/CardViewIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import UploadDocumentModal from '@/components/knowledge/UploadDocumentModal';

// Document icons mapping
const getDocumentIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  
  if (lowerType === 'pdf') {
    return (
      <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-xl flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6M9 13h6M9 17h6"/>
        </svg>
      </div>
    );
  } else if (lowerType === 'faq' || lowerType === 'text') {
    return (
      <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-xl flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6M12 18v-6M12 10h.01"/>
        </svg>
      </div>
    );
  } else if (lowerType === 'csv') {
    return (
      <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-xl flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"/>
        </svg>
      </div>
    );
  } else {
    return (
      <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-xl flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
        </svg>
      </div>
    );
  }
};

// Document Card Component for Grid View
const DocumentCard = ({ 
  document 
}: { 
  document: Document;
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'processing':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'draft':
        return 'bg-[#E5E7EB] text-[#6B7280]';
      case 'error':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      default:
        return 'bg-[#E5E7EB] text-[#6B7280]';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getDocumentIcon(document.type)}
            <div>
              <h3 className="font-semibold text-[#1F2937] text-sm">{document.name}</h3>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
            </div>
          </div>
          <div className="relative group">
            <button className="text-[#9CA3AF] hover:text-[#6B7280]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="5" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="10" cy="15" r="2" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 hidden group-hover:block">
              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center">
                View Details
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center">
                Download
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center text-[#DC2626]">
                Delete Document
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#6B7280] mb-4">{document.type === 'pdf' ? 'Frequently asked questions about our product features' : document.type === 'faq' ? 'Complete sales process and objection handling guide' : 'Customer contact information and preferences'}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Size</span>
            <span className="font-medium text-[#1F2937]">{document.size}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Modified</span>
            <span className="font-medium text-[#1F2937]">{document.lastUpdated}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <span className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded">product</span>
          <span className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded">support</span>
          <span className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded">faq</span>
        </div>
      </div>
    </div>
  );
};

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const documentsData: Document[] = [
    {
      name: 'Product FAQ',
      type: 'pdf',
      status: 'Published',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Sales Playbook',
      type: 'faq',
      status: 'Published',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Customer Data Export',
      type: 'csv',
      status: 'Processing',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Support Guidelines',
      type: 'text',
      status: 'Draft',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'API Documentation',
      type: 'text',
      status: 'Error',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
  ];

  const filteredData = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || doc.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">Knowledge Base</h1>
              <p className="text-[#6B7280] mt-1 text-sm">Manage documents and content for your AI agents</p>
            </div>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center space-x-2 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span>Upload Document</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#8266D4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Total Documents</p>
                  <p className="text-2xl font-semibold text-black">5</p>
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
                  <p className="text-sm text-[#6B7280]">Published Documents</p>
                  <p className="text-2xl font-semibold text-black">2</p>
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
                  <p className="text-sm text-[#6B7280]">Processing</p>
                  <p className="text-2xl font-semibold text-black">1</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Errors</p>
                  <p className="text-2xl font-semibold text-black">1</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card className="flex items-center gap-4 px-8 py-6">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
                icon={<SearchIcon />}
              />
            </div>

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="px-5 py-3 border border-[#D1D5DB] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterType}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Types', 'pdf', 'faq', 'csv', 'text'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterType(option);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterType === option ? 'bg-[#EEF2FF]' : ''}`}
                      >
                        <span className={filterType === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                          {option}
                        </span>
                        {filterType === option && (
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
                    {['All Status', 'Published', 'Processing', 'Draft', 'Error'].map((option) => (
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

        <Card className='p-6'>
          {/* View Toggle and Documents Section */}
          <div className="">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Knowledge Base</h2>
              <div className="flex items-center space-x-2 border border-[#EBEBEB] p-[5px] rounded-[10px]">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-[10px] cursor-pointer ${view === 'list' ? 'bg-[#007BFF1A] border border-[#41288A]' : ''}`}
                >
                  <ListViewIcon />
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 rounded-[10px] cursor-pointer ${view === 'grid' ? 'bg-[#007BFF1A] border border-[#41288A]' : ''}`}
                >
                  <CardViewIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Table or Grid */}
          {view === 'list' ? (
            <SharedTable<Document>
              type="documents"
              data={filteredData}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((document, index) => (
                <DocumentCard 
                  key={index} 
                  document={document}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <UploadDocumentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
      />
    </DashboardLayout>
  );
}