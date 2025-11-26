'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic here
        console.log('Forgot password submitted:', email);
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                {/* Title and subtitle */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">Forgot Your Password?</h1>
                    <p className="text-sm text-black opacity-70">Don't worry, we'll send you a reset link to your email.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Type..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* Submit button */}
                    <Button type="submit" className="mt-5">
                        Send Reset Link
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
