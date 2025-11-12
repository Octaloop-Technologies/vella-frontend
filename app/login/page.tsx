'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Title and subtitle */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Welcome Back</h1>
          <p className="text-sm text-black opacity-70">Sign in to your account to continue.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="User Name"
            type="text"
            placeholder="Type..."
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Type..."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-[#CCCCCC] text-[#8266D4] focus:ring-[#8266D4] focus:ring-offset-0 cursor-pointer"
              />
              <span className="ml-2 text-[#1E1E1E]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[#1E1E1E] hover:text-[#8266D4] transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <Link href="/dashboard" passHref>
          <Button type="submit" className="mt-6">
            Log In
          </Button>
          </Link>
        </form>

        {/* Sign up link */}
        <div className="text-center text-sm">
          <span className="text-sm text-black">Doesn't have an account? </span>
          <Link href="/signup" className="text-black font-bold hover:text-[#8266D4] transition-colors underline">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
