'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Badge from '@/components/shared/Badge';

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id?: string;
    name: string;
    type: string;
    status: string;
    statusVariant: 'published' | 'processing' | 'draft' | 'error';
    size: string;
    lastUpdated: string;
    tags?: string[];
    content?: string;
  } | null;
}

const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({ 
  isOpen, 
  onClose,
  document
}) => {
  if (!document) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-3xl" 
      title="Document Details"
      subtitle={`View detailed information about ${document.name}`}
    >
      <div className="p-10">
        {/* Document Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Document Name</label>
            <p className="text-black font-medium">{document.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
            <p className="text-black font-medium uppercase">{document.type}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
            <Badge variant={document.statusVariant}>{document.status}</Badge>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Size</label>
            <p className="text-black font-medium">{document.size}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Last Updated</label>
            <p className="text-black font-medium">{document.lastUpdated}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Document ID</label>
            <p className="text-black font-medium text-xs">{document.id || 'N/A'}</p>
          </div>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#F3F0FF] text-[#41288A] rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Preview */}
        {document.content && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Content Preview</label>
            <div className="bg-[#EBEBEB] rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-black text-sm whitespace-pre-wrap">{document.content}</p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DocumentDetailsModal;
