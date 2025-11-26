'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store the token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);

      // Update auth context
      await checkAuth();

      addToast({ 
        message: "Logged in successfully!", 
        type: "success" 
      });
      
      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
      
      // Check if the error is related to email verification
      if (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('inactive')) {
        addToast({ 
          message: "Please verify your email before logging in.", 
          type: "error" 
        });
        
        // Redirect to resend verification page
        setTimeout(() => {
          router.push(`/resend-verification?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        addToast({ 
          message: errorMessage, 
          type: "error" 
        });
      }
    } finally {
      setIsLoading(false);
    }
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
            label="Email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </Button>
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
