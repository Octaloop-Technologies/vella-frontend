'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useToast } from '@/contexts/ToastContext';

const SignUpPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      addToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.workEmail,
          name: formData.fullName,
          organization: formData.organization,
          password: formData.password,
          role: "user"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      addToast({ 
        message: "Account created successfully! Please check your email to verify your account.", 
        type: "success" 
      });
      
      // Redirect to resend-verification page (which acts as a "check email" page)
      setTimeout(() => {
        router.push(`/resend-verification?email=${encodeURIComponent(formData.workEmail)}&sent=true`);
      }, 2000);

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
    <AuthLayout>
      <div className="space-y-6">
        {/* Title and subtitle */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Create Your Account</h1>
          <p className="text-sm text-black opacity-70">Join the AI Voice & Chat platform and get started in minutes.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="Type..."
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="Type..."
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
            required
          />

          <Input
            label="Organization"
            type="text"
            placeholder="Type..."
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Type..."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Type..."
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          {/* Submit button */}
          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Log in link */}
        <div className="text-center text-sm">
          <span className="text-[#6E6E6E]">Already have an account? </span>
          <Link href="/login" className="text-[#1E1E1E] font-semibold hover:text-[#8266D4] transition-colors">
            Log In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
