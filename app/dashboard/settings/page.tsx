"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import EditPersonalInfoModal from '@/components/settings/EditPersonalInfoModal';
import Image from 'next/image';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notification'>('general');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'AgentBuilder Inc.',
    email: 'example@email.com',
    organization: 'Organization 1'
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false
  });

  const handleUpdatePassword = () => {
    // Add password update logic here
    console.log('Updating password:', passwordData);
  };

  const handleSavePersonalInfo = (data: { fullName: string; email: string; organization: string }) => {
    setPersonalInfo(data);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-black">Settings</h1>
          <p className="text-black mt-2 font-medium text-sm opacity-70">Manage your account and application preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex items-center gap-4 shadow-card rounded-[10px] bg-white p-1 w-fit">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-8 py-2 rounded-[10px] font-medium transition-all w-56 cursor-pointer ${activeTab === 'general'
              ? 'bg-[#007BFF1A] text-[#8266D4] border border-[#8266D4]'
              : 'bg-white text-[#6B7280] border border-white'
              }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`px-8 py-2 rounded-[10px] font-medium text-base transition-all w-56 cursor-pointer ${activeTab === 'notification'
              ? 'bg-[#007BFF1A] text-[#8266D4] border border-[#8266D4]'
              : 'bg-white text-[#6B7280] border border-white'
              }`}
          >
            Notification
          </button>
        </div>

        {/* General Tab Content */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Personal Information Card */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-black">Personal Information</h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer"
                >
                  <Image src="/svgs/file-edit.svg" alt="Edit" width={24} height={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Type..."
                  className="bg-[#EBEBEB]"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Type..."
                  className="bg-[#EBEBEB]"
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <Input
                  label="Organization"
                  type="text"
                  placeholder="Type..."
                  className="bg-[#EBEBEB]"
                />
              </div>
            </Card>

            {/* Update Password Card */}
            <Card className="p-4">
              <h2 className="text-lg font-medium mb-4 text-black">Update Password</h2>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Type..."
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-[#EBEBEB]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Enter New Password"
                    type="password"
                    placeholder="Type..."
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-[#EBEBEB]"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Type..."
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-[#EBEBEB]"
                  />
                </div>
              </div>

              <div className="max-w-[232px]">
                <Button className='font-medium' onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notification Tab Content */}
        {activeTab === 'notification' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-6 text-black">Notification Preferences</h2>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shadow-card ${notifications.email ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <div>
                  <h3 className="font-medium mb-2 text-black">Email Notifications</h3>
                  <p className="text-xs opacity-70 text-black">Receive email alerts for agent activities and system updates</p>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shadow-card ${notifications.sms ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <div>
                  <h3 className="font-medium mb-2 text-black">SMS Notifications</h3>
                  <p className="text-xs opacity-70 text-black">Get urgent alerts via SMS for critical issues</p>
                </div>

              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Personal Information Modal */}
      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        personalInfo={personalInfo}
        onSave={handleSavePersonalInfo}
      />
    </DashboardLayout>
  );
}