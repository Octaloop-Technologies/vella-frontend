'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Sign up submitted:', formData);
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
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="Type..."
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
          />

          <Input
            label="Organization"
            type="text"
            placeholder="Type..."
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Type..."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Type..."
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          {/* Submit button */}
          <Button type="submit" className="mt-6">
            Create Account
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
