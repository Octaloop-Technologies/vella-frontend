'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import Button from '@/components/shared/Button';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [uploadType, setUploadType] = useState<'file' | 'text' | 'url'>('file');
  const [documentName, setDocumentName] = useState('');
  const [dragActive, setDragActive] = useState(false);

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
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload
      console.log('File selected:', e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Add your upload logic here
    console.log('Uploading document:', documentName);
    onClose();
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
          <button
            onClick={() => setUploadType('url')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'url'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#007BFF1A] text-black border border-[#8266D4]'
            }`}
          >
            URL Reference
          </button>
        </div>

        {/* Document Name */}
        <div className="mb-6">
          <Input label="Name" placeholder="Enter document name..." value={documentName} onChange={(e) => setDocumentName(e.target.value)}  />
        </div>

        {/* Upload Area */}
        {uploadType === 'file' && (
          <div
            className={`rounded-lg p-12 text-center mb-6 transition-colors ${
              dragActive 
                ? 'border-[#8266D4] bg-[#F3F0FF]' 
                : 'bg-[#EBEBEB]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Image className='mb-4' src="/svgs/upload2.svg" alt="Upload" width={24} height={24} />
              <p className="font-medium mb-1 text-black">Drop files here or click to browse</p>
              <p className="text-xs text-black">Supports PDF, Word, CSV, and text files</p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.csv,.txt"
              />
            </div>
          </div>
        )}

        {uploadType === 'text' && (
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-2">Content</label>
            <textarea
              placeholder="Paste or type your content here..."
              rows={8}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-lg outline-none text-sm border border-transparent resize-none text-black"
            />
          </div>
        )}

        {uploadType === 'url' && (
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              placeholder="https://example.com/document"
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-lg outline-none text-sm border border-transparent text-black"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 max-w-md mx-auto">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#8266D4] text-[#8266D4] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors shadow-card"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-card"
          >
            Upload Document
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UploadDocumentModal;
