import React from 'react';
import BaseModal from '@/components/shared/BaseModal';

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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={false}>
      <div className="p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path 
                d="M27 7H22V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3H12C11.4696 3 10.9609 3.21071 10.5858 3.58579C10.2107 3.96086 10 4.46957 10 5V7H5C4.73478 7 4.48043 7.10536 4.29289 7.29289C4.10536 7.48043 4 7.73478 4 8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9H6V25C6 25.5304 6.21071 26.0391 6.58579 26.4142C6.96086 26.7893 7.46957 27 8 27H24C24.5304 27 25.0391 26.7893 25.4142 26.4142C25.7893 26.0391 26 25.5304 26 25V9H27C27.2652 9 27.5196 8.89464 27.7071 8.70711C27.8946 8.51957 28 8.26522 28 8C28 7.73478 27.8946 7.48043 27.7071 7.29289C27.5196 7.10536 27.2652 7 27 7ZM12 5H20V7H12V5ZM24 25H8V9H24V25Z" 
                fill="#DC2626"
              />
              <path 
                d="M13 13V21C13 21.2652 13.1054 21.5196 13.2929 21.7071C13.4804 21.8946 13.7348 22 14 22C14.2652 22 14.5196 21.8946 14.7071 21.7071C14.8946 21.5196 15 21.2652 15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12C13.7348 12 13.4804 12.1054 13.2929 12.2929C13.1054 12.4804 13 12.7348 13 13Z" 
                fill="#DC2626"
              />
              <path 
                d="M17 13V21C17 21.2652 17.1054 21.5196 17.2929 21.7071C17.4804 21.8946 17.7348 22 18 22C18.2652 22 18.5196 21.8946 18.7071 21.7071C18.8946 21.5196 19 21.2652 19 21V13C19 12.7348 18.8946 12.4804 18.7071 12.2929C18.5196 12.1054 18.2652 12 18 12C17.7348 12 17.4804 12.1054 17.2929 12.2929C17.1054 12.4804 17 12.7348 17 13Z" 
                fill="#DC2626"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1F2937] mb-3">Delete Agent</h2>
        
        {/* Description */}
        <p className="text-sm text-[#6B7280] mb-8">
          This action cannot be undone. Delete agent "{agentName}"?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#E5E7EB] text-[#1F2937] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-6 py-3 bg-[#DC2626] text-white rounded-lg font-medium hover:bg-[#B91C1C] transition-colors"
          >
            Delete Agent
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteAgentModal;