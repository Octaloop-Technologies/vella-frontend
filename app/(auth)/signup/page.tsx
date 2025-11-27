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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid()) {
      addToast({ message: "Please meet all password requirements", type: "error" });
      return;
    }

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
      
      setTimeout(() => {
        router.push(`/resend-verification?email=${encodeURIComponent(formData.workEmail)}&sent=true`);
      }, 2000);

    } catch (error: any) {
      addToast({ 
        message: "Error creating account Please try again.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Eye Icon Component
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
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
          <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Create Your Account</h1>
          <p className="text-sm text-black opacity-70">Join the AI Voice & Chat platform and get started in minutes.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-black">
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

          <div className="space-y-2">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Type..."
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                onFocus={() => setShowPasswordRequirements(true)}
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
            
            {/* Password Requirements */}
            {showPasswordRequirements && formData.password && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation.minLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation.hasNumber ? '✓' : '○'}</span>
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation.hasSpecial ? '✓' : '○'}</span>
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative  ">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Type..."
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Password mismatch warning */}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}

          {/* Submit button */}
          <Button 
            type="submit" 
            className="mt-6" 
            disabled={isLoading || !isPasswordValid() || formData.password !== formData.confirmPassword}
          >
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