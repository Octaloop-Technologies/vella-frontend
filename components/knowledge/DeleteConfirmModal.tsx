'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Image from 'next/image';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentName: string;
  isDeleting: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose,
  onConfirm,
  documentName,
  isDeleting
}) => {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-xl"
      showCloseButton={false}
    >
      <div className="p-10 pt-14 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#CF17421A] rounded-full flex items-center justify-center">
            <Image src="/svgs/trash.svg" alt="Warning" width={24} height={24} />
          </div>
        </div>

        <h2 className="text-lg font-medium mb-3 text-black">Delete Document</h2>
        <p className="text-xs opacity-70 mb-8 text-black">
          This action cannot be undone. Delete document "{documentName}"?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 border border-[#8266D4] text-[#8266D4] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 border border-[#CF1742] bg-[#CF17421A] text-[#CF1742] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Document'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmModal;
