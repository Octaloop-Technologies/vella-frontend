'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reset password logic here
    console.log('Reset password submitted:', formData);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Title and subtitle */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Reset Your Password</h1>
          <p className="text-sm">Enter a new password to secure your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            Update Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
