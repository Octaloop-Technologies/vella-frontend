"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { Document } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import ListViewIcon from '@/components/icons/ListViewIcon';
import CardViewIcon from '@/components/icons/CardViewIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import UploadDocumentModal from '@/components/knowledge/UploadDocumentModal';
import DocumentDetailsModal from '@/components/knowledge/DocumentDetailsModal';
import DeleteConfirmModal from '@/components/knowledge/DeleteConfirmModal';
import Image from 'next/image';
import StatsCard from '@/components/shared/StatsCard';
import ItemCard from '@/components/shared/ItemCard';
import Badge from '@/components/shared/Badge';
import FilterDropdown from '@/components/shared/FilterDropdown';

// API Document type
interface ApiDocument {
  id: string;
  name: string;
  content: string;
  document_type: 'pdf' | 'faq' | 'csv' | 'text' | 'guidelines';
  status: 'uploading' | 'processing' | 'published' | 'error' | 'draft';
  tags: string[];
  metadata: Record<string, any>;
  vector_id: string;
  created_at: string;
  updated_at: string;
  size: number;
}

// Document icons mapping
const getDocumentIcon = (type: string) => {
  const lowerType = type.toLowerCase();

  if (lowerType === 'pdf') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/question.svg" alt="PDF Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'faq') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/page2.svg" alt="FAQ Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'csv') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/stats2.svg" alt="CSV Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'guidelines') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/journal.svg" alt="Guidelines Document" width={42} height={42} />
      </div>
    );
  } else {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/page2.svg" alt="Document" width={42} height={42} />
      </div>
    );
  }
};

const getDocumentDescription = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'Frequently asked questions about our product features';
    case 'faq':
      return 'Complete sales process and objection handling guide';
    case 'csv':
      return 'Customer contact information and preferences';
    case 'guidelines':
      return 'Internal support team guidelines and procedures';
    default:
      return 'Technical API documentation for developers';
  }
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// Helper function to map API status to display status
const mapStatus = (status: string): { status: string; variant: 'published' | 'processing' | 'draft' | 'error' } => {
  const statusMap: Record<string, { status: string; variant: 'published' | 'processing' | 'draft' | 'error' }> = {
    'uploading': { status: 'Processing', variant: 'processing' },
    'processing': { status: 'Processing', variant: 'processing' },
    'published': { status: 'Published', variant: 'published' },
    'error': { status: 'Error', variant: 'error' },
    'draft': { status: 'Draft', variant: 'draft' },
  };
  return statusMap[status.toLowerCase()] || { status: 'Draft', variant: 'draft' };
};

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documentsData, setDocumentsData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch documents from API
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/knowledge?skip=0&limit=100');
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const apiDocuments: ApiDocument[] = await response.json();
      
      // Transform API data to match Document interface
      const transformedDocuments: Document[] = apiDocuments.map((doc) => {
      
        const { status: displayStatus, variant } = mapStatus(doc.status);
        const fileSize = doc.metadata?.file_size_bytes || doc.size || 0;
        return {
          name: doc.name,
          type: doc.document_type,
          status: displayStatus,
          statusVariant: variant,
          size: formatFileSize(fileSize),
          lastUpdated: formatDate(doc.updated_at),
          id: doc.id,
          tags: doc.tags,
          onViewDetails: () => handleViewDetails({
            name: doc.name,
            type: doc.document_type,
            status: displayStatus,
            statusVariant: variant,
            size: formatFileSize(fileSize),
            lastUpdated: formatDate(doc.updated_at),
            id: doc.id,
            tags: doc.tags,
          }),
          onDownload: () => handleDownload({
            name: doc.name,
            type: doc.document_type,
            status: displayStatus,
            statusVariant: variant,
            size: formatFileSize(fileSize),
            lastUpdated: formatDate(doc.updated_at),
            id: doc.id,
            tags: doc.tags,
          }),
          onDelete: () => handleDeleteClick({
            name: doc.name,
            type: doc.document_type,
            status: displayStatus,
            statusVariant: variant,
            size: formatFileSize(fileSize),
            lastUpdated: formatDate(doc.updated_at),
            id: doc.id,
            tags: doc.tags,
          }),
        };
      });

      setDocumentsData(transformedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
      // Fallback to empty array on error
      setDocumentsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh the documents list after successful upload
    fetchDocuments();
  };

  const handleViewDetails = async (document: Document) => {
    try {
      // Fetch full document details from API
      const response = await fetch(`/api/knowledge/${document.id}`);
      if (response.ok) {
        const fullDocument = await response.json();
        setSelectedDocument({
          ...document,
          content: fullDocument.content
        });
      } else {
        setSelectedDocument(document);
      }
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error fetching document details:', error);
      setSelectedDocument(document);
      setIsDetailsModalOpen(true);
    }
  };

  const handleDownload = (document: Document) => {
    // Create a blob with the document content
    const content = `Document: ${document.name}\nType: ${document.type}\nSize: ${document.size}\nLast Updated: ${document.lastUpdated}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.name}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete?.id) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/knowledge/${documentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Refresh the documents list
      await fetchDocuments();
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate stats from actual data
  const stats = {
    total: documentsData.length,
    published: documentsData.filter(d => d.status === 'Published').length,
    processing: documentsData.filter(d => d.status === 'Processing').length,
    errors: documentsData.filter(d => d.status === 'Error').length,
  };

  const statsCards = [
    {
      title: "Total Documents",
      icon: <Image src="/svgs/page.svg" alt="Total Documents" width={20} height={20} />,
      value: stats.total.toString(),
    },
    {
      title: "Published Documents",
      icon: <Image src="/svgs/badge-check.svg" alt="Published Documents" width={20} height={20} />,
      value: stats.published.toString(),
    },
    {
      title: "Processing",
      icon: <Image src="/svgs/clock-five.svg" alt="Processing" width={20} height={20} />,
      value: stats.processing.toString(),
    },
    {
      title: "Errors",
      icon: <Image src="/svgs/exclamation.svg" alt="Errors" width={20} height={20} />,
      value: stats.errors.toString(),
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
              <h1 className="text-lg font-semibold text-brand-black">Knowledge Base</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Manage documents and content for your AI agents</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Image src="/svgs/upload.svg" alt="Upload Document" width={24} height={24} />
              <span>Upload Document</span>
            </button>
          </div>

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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
                icon={<SearchIcon />}
              />
            </div>

            <div className="relative w-[15%]">
              <FilterDropdown
                isOpen={isTypeDropdownOpen}
                setIsOpen={setIsTypeDropdownOpen}
                value={filterType}
                setValue={setFilterType}
                options={['All Types', 'pdf', 'faq', 'csv', 'text']}
              />
            </div>

            <div className="relative w-[15%]">
              <FilterDropdown
                isOpen={isStatusDropdownOpen}
                setIsOpen={setIsStatusDropdownOpen}
                value={filterStatus}
                setValue={setFilterStatus}
                options={['All Status', 'Published', 'Processing', 'Draft', 'Error']}
              />
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41288A] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#41288A] text-white rounded-lg hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No documents found</p>
            </div>
          ) : view === 'list' ? (
            <SharedTable<Document>
              type="documents"
              data={filteredData}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredData.map((document, index) => (
                <ItemCard
                  key={document.id || index}
                  icon={getDocumentIcon(document.type)}
                  title={document.name}
                  description={getDocumentDescription(document.type)}
                  badges={[
                    { label: document.status, variant: document.statusVariant }
                  ]}
                  stats={[
                    { label: 'Size', value: document.size },
                    { label: 'Modified', value: document.lastUpdated }
                  ]}
                  footerTags={document.tags || ['product', 'support', 'faq']}
                  menuItems={[
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ),
                      label: 'View Details',
                      onClick: () => handleViewDetails(document)
                    },
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      ),
                      label: 'Download',
                      onClick: () => handleDownload(document)
                    },
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      ),
                      label: 'Delete Document',
                      className: 'text-[#DC2626]',
                      onClick: () => handleDeleteClick(document)
                    }
                  ]}
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
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        documentName={documentToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}