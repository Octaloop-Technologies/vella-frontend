'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useToast } from '@/contexts/ToastContext';

const ResendVerificationContent = () => {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const sentParam = searchParams.get('sent');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (sentParam === 'true') {
      setIsSent(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend verification email');
      }

      setIsSent(true);
      addToast({ 
        message: "Verification email sent successfully!", 
        type: "success" 
      });

    } catch (error: any) {
      addToast({ 
        message: error.message || "Something went wrong", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
          {isSent ? 'Check Your Email' : 'Resend Verification'}
        </h1>
        <p className="text-sm text-black opacity-70">
          {isSent 
            ? 'We have sent a verification link to your email address.' 
            : "Enter your email address and we'll send you a new verification link."}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Link'}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-green-50 p-4 rounded-lg text-green-700 text-sm">
            If an account exists for <strong>{email}</strong>, you will receive a verification email shortly.
          </div>
          <Link href="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
          <button 
            onClick={() => setIsSent(false)} 
            className="text-sm text-[#8266D4] hover:underline"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      )}

      {!isSent && (
        <div className="text-center text-sm">
          <Link href="/login" className="text-[#1E1E1E] font-semibold hover:text-[#8266D4] transition-colors">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
};

const ResendVerificationPage = () => {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResendVerificationContent />
      </Suspense>
    </AuthLayout>
  );
};

export default ResendVerificationPage;
