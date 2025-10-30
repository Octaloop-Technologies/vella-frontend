import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Image from 'next/image';

interface DeleteAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
  onConfirmDelete?: () => void;
}

const DeleteAgentModal: React.FC<DeleteAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  agentName = 'Sales Assistant',
  onConfirmDelete 
}) => {
  const handleDelete = () => {
    if (onConfirmDelete) {
      onConfirmDelete();
    }
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" showCloseButton={false}>
      <div className="p-10 pt-14 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#CF17421A] rounded-full flex items-center justify-center">
            <Image src="/svgs/trash.svg" alt="Warning" width={24} height={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium mb-3 text-black">Delete Agent</h2>
        
        {/* Description */}
        <p className="text-xs opacity-70 mb-8 text-black">
          This action cannot be undone. Delete agent "{agentName}"?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#8266D4] text-[#8266D4] rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-6 py-3 border border-[#CF1742] bg-[#CF17421A] text-[#CF1742] rounded-lg font-medium"
          >
            Delete Agent
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteAgentModal;