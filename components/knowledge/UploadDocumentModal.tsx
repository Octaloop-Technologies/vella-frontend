'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-10">
        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1F2937] mb-2">Upload Document</h2>
        <p className="text-sm text-[#6B7280] mb-6">Upload documents to expand your AI agents' knowledge base</p>

        {/* Upload Type Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUploadType('file')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'file'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#E8E3F3] text-[#41288A]'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => setUploadType('text')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'text'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#E8E3F3] text-[#41288A]'
            }`}
          >
            Text Content
          </button>
          <button
            onClick={() => setUploadType('url')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              uploadType === 'url'
                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                : 'bg-[#E8E3F3] text-[#41288A]'
            }`}
          >
            URL Reference
          </button>
        </div>

        {/* Document Name */}
        <div className="mb-6">
          <label className="block text-[#1F2937] text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter document name..."
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg outline-none text-sm border border-transparent focus:border-[#8266D4] focus:ring-1 focus:ring-[#8266D4]"
          />
        </div>

        {/* Upload Area */}
        {uploadType === 'file' && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
              dragActive 
                ? 'border-[#8266D4] bg-[#F3F0FF]' 
                : 'border-[#D1D5DB] bg-[#F9FAFB]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8266D4" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <p className="text-[#1F2937] font-medium mb-1">Drop files here or click to browse</p>
              <p className="text-sm text-[#6B7280]">Supports PDF, Word, CSV, and text files</p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.csv,.txt"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-[#F9FAFB]"
              >
                Select File
              </label>
            </div>
          </div>
        )}

        {uploadType === 'text' && (
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-2">Content</label>
            <textarea
              placeholder="Paste or type your content here..."
              rows={8}
              className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg outline-none text-sm border border-transparent focus:border-[#8266D4] focus:ring-1 focus:ring-[#8266D4] resize-none"
            />
          </div>
        )}

        {uploadType === 'url' && (
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              placeholder="https://example.com/document"
              className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg outline-none text-sm border border-transparent focus:border-[#8266D4] focus:ring-1 focus:ring-[#8266D4]"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#E5E7EB] text-[#1F2937] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Upload Document
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UploadDocumentModal;
