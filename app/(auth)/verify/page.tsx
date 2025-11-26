'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/shared/Button';
import { useToast } from '@/contexts/ToastContext';

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const token = searchParams.get('token');
  const verifyAttempted = useRef(false);
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Token is missing.');
      return;
    }

    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'POST',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        addToast({ message: "Email verified successfully!", type: "success" });

      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
        addToast({ message: error.message || "Verification failed", type: "error" });
      }
    };

    verifyEmail();
  }, [token, addToast]);

  const handleResendVerification = async () => {
    router.push('/resend-verification');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Email Verification</h1>
        <p className="text-sm text-black opacity-70">{message}</p>
      </div>

      {status === 'verifying' && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8266D4]"></div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="flex justify-center text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="flex justify-center text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <Button onClick={handleResendVerification} className="w-full">
            Resend Verification Email
          </Button>
        </div>
      )}
    </div>
  );
};

const VerifyPage = () => {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </AuthLayout>
  );
};

export default VerifyPage;
