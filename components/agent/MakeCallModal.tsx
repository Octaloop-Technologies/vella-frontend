"use client";

import { useState } from 'react';

import Input from '@/components/shared/Input';
import BaseModal from '../shared/BaseModal';

interface MakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export default function MakeCallModal({ isOpen, onClose, agentId, agentName }: MakeCallModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [callDetails, setCallDetails] = useState<any>(null);

  const handleClose = () => {
    setPhoneNumber('');
    setError('');
    setSuccess(false);
    setCallDetails(null);
    onClose();
  };

  const handleMakeCall = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    // Basic phone number validation (should start with + and contain only digits)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
      setError('Please enter a valid phone number (e.g., +923088824657)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('agent_id', agentId);
      formData.append('to_number', phoneNumber);
      formData.append('from_number', '');

      const response = await fetch('https://ai-voice-agent-backend.octaloop.dev/twilio/outbound/make-call', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setCallDetails(data);
        // Auto close after 3 seconds on success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(data.message || 'Failed to initiate call. Please try again.');
      }
    } catch (err) {
      console.error('Error making call:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleMakeCall();
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      maxWidth="max-w-md"
      title="Make Outbound Call"
      subtitle={`Initiate a call using ${agentName}`}
    >
      {!success ? (
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                placeholder="+923084324657"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyPress}
                className="w-full"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter number with country code (e.g., +92 for Pakistan)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeCall}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Calling...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                    <span>Make Call</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Initiated Successfully!</h3>
            <p className="text-sm text-gray-600 mb-4">
              {callDetails?.message || 'Your outbound call has been initiated'}
            </p>

            {callDetails?.call && (
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Call Status:</span>
                  <span className="font-medium text-gray-900 capitalize">{callDetails.call.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium text-gray-900">{callDetails.call.to}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium text-gray-900">{callDetails.call.from}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Call SID:</span>
                  <span className="font-mono text-xs text-gray-900">{callDetails.call.call_sid}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full px-4 py-2.5 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
