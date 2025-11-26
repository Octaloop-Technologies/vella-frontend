'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import Button from '@/components/shared/Button';
import { apiService } from '@/lib/api';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ 
  isOpen, 
  onClose,
  onUploadSuccess
}) => {
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [documentName, setDocumentName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only PDF, Word, and CSV files are supported.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only PDF, Word, and CSV files are supported.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const getDocumentType = (file: File): string => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'text/csv') return 'csv';
    if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'text';
    return 'text';
  };

  const handleUpload = async () => {
    setError(null);
    
    // Validation
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    if (uploadType === 'file' && !selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (uploadType === 'text' && !textContent.trim()) {
      setError('Please enter some content');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('name', documentName.trim());
      
      if (uploadType === 'file' && selectedFile) {
        formData.append('file', selectedFile);
        formData.append('document_type', getDocumentType(selectedFile));
        formData.append('content', ''); // Empty content for file uploads
      } else if (uploadType === 'text') {
        formData.append('document_type', 'text');
        formData.append('content', textContent.trim());
      }
      
      // Add tags (empty array for now)
      formData.append('tags', tags || '');

      const data = await apiService.uploadDocument(formData);

      console.log('Document uploaded successfully:', data);
      
      // Reset form
      setDocumentName('');
      setTextContent('');
      setSelectedFile(null);
      setTags('');
      setError(null);
      
      // Call success callback to refresh the documents list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" title='Upload Document' subtitle="Upload documents to expand your AI agents' knowledge base">
      <div className="p-10">

        {/* Upload Type Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUploadType('file')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'file'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#007BFF1A] text-black border border-[#8266D4]'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => setUploadType('text')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'text'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#007BFF1A] text-black border border-[#8266D4]'
            }`}
          >
            Text Content
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Document Name */}
        <div className="mb-6">
          <Input label="Name" placeholder="Enter document name..." value={documentName} onChange={(e) => setDocumentName(e.target.value)}  />
        </div>

        {/* Upload Area */}
        {uploadType === 'file' && (
          <>
            <div
              className={`rounded-lg p-12 text-center mb-6 transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-2 border-dashed border-[#8266D4] bg-[#F3F0FF]' 
                  : 'border-2 border-dashed border-[#EBEBEB] bg-[#EBEBEB]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="flex flex-col items-center">
                <Image className='mb-4' src="/svgs/upload2.svg" alt="Upload" width={24} height={24} />
                <p className="font-medium mb-1 text-black">
                  {selectedFile ? selectedFile.name : 'Drop files here or click to browse'}
                </p>
                <p className="text-xs text-black">Supports PDF, Word, and CSV files</p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.csv"
                />
              </div>
            </div>
          </>
        )}

        {uploadType === 'text' && (
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-2">Content</label>
            <textarea
              placeholder="Paste or type your content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-lg outline-none text-sm border border-transparent resize-none text-black"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 max-w-md mx-auto">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 px-6 py-3 border border-[#8266D4] text-[#8266D4] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UploadDocumentModal;
