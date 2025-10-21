'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Image from 'next/image';

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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title="Edit Personal Information" showCloseButton={false}>
      <button
        onClick={onClose}
        className="absolute top-6 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-[#CF1742] transition-colors z-10 cursor-pointer"
      >
        <Image src="/svgs/cross2.svg" alt="Close" width={10} height={10} />
      </button>
      <div className="p-8">
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
            className="w-full py-3 rounded-[10px] border border-[#CF1742] text-[#F44336] font-medium bg-[#CF17421A] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditPersonalInfoModal;