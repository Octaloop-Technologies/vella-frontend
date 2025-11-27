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
  const [showPassword, setShowPassword] = useState(false);
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

  // Custom Eye Icon Component
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" 
        fill="currentColor" 
        opacity="0.6"
      />
    </svg>
  );

  // Custom Eye Off Icon Component
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" 
        fill="currentColor" 
        opacity="0.6"
      />
    </svg>
  );

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

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Type..."
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

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