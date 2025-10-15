'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: {
    fullName: string;
    email: string;
    organization: string;
  };
  onSave: (data: { fullName: string; email: string; organization: string }) => void;
}

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  personalInfo,
  onSave
}) => {
  const [formData, setFormData] = useState(personalInfo);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={true}>
      <div className="p-8">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Edit Personal Information</h2>
        
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Type..."
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="bg-[#EBEBEB]"
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Type..."
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-[#EBEBEB]"
          />
          
          <Input
            label="Organization"
            placeholder="Type..."
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="bg-[#EBEBEB]"
          />
        </div>

        <div className="mt-6 space-y-3">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-[10px] border-2 border-[#F44336] text-[#F44336] font-medium hover:bg-[#F443361A] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditPersonalInfoModal;