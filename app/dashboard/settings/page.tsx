"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import EditPersonalInfoModal from '@/components/settings/EditPersonalInfoModal';

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
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Settings</h1>
          <p className="text-[#6B7280] mt-1 text-sm">Manage your account and application preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-8 py-3 rounded-[10px] font-medium text-base transition-all ${
              activeTab === 'general'
                ? 'bg-[#EEF2FF] text-[#1F2937] border-2 border-[#41288A]'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`px-8 py-3 rounded-[10px] font-medium text-base transition-all ${
              activeTab === 'notification'
                ? 'bg-[#EEF2FF] text-[#1F2937] border-2 border-[#41288A]'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            Notification
          </button>
        </div>

        {/* General Tab Content */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Personal Information Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1F2937]">Personal Information</h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">Full Name</label>
                  <div className="px-4 py-3 bg-[#EBEBEB] rounded-[10px] text-sm text-[#1F2937]">
                    {personalInfo.fullName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#6B7280] mb-2">Email</label>
                  <div className="px-4 py-3 bg-[#EBEBEB] rounded-[10px] text-sm text-[#1F2937]">
                    {personalInfo.email}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-[#6B7280] mb-2">Organization</label>
                  <div className="px-4 py-3 bg-[#EBEBEB] rounded-[10px] text-sm text-[#1F2937]">
                    {personalInfo.organization}
                  </div>
                </div>
              </div>
            </Card>

            {/* Update Password Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#1F2937] mb-6">Update Password</h2>

              <div className="space-y-4 mb-6">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Type..."
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-[#EBEBEB]"
                />

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
                <Button onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notification Tab Content */}
        {activeTab === 'notification' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-6">Notification Preferences</h2>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1F2937] mb-1">Email Notifications</h3>
                  <p className="text-sm text-[#6B7280]">Receive email alerts for agent activities and system updates</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1F2937] mb-1">SMS Notifications</h3>
                  <p className="text-sm text-[#6B7280]">Get urgent alerts via SMS for critical issues</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.sms ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
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