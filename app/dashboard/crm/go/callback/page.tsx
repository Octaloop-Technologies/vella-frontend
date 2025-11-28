'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const code = searchParams.get('code');
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const hasCalledConnect = useRef(false);

  useEffect(() => {
    if (!code) {
      setStatus('error');
      addToast({ message: "Authorization code missing", type: "error" });
      return;
    }

    if (hasCalledConnect.current) return;
    hasCalledConnect.current = true;

    const connectGHL = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';

        const response = await fetch('/api/ghl/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokenType} ${token}`,
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to connect GoHighLevel');
        }

        setStatus('success');
        addToast({ message: "GoHighLevel connected successfully!", type: "success" });
        
        // Redirect back to integrations page or return url after a short delay
        setTimeout(() => {
          const returnUrl = localStorage.getItem('ghl_return_url');
          if (returnUrl) {
            localStorage.removeItem('ghl_return_url');
            window.location.href = returnUrl;
          } else {
            router.push('/dashboard/integration');
          }
        }, 2000);

      } catch (error: any) {
        console.error('Connection error:', error);
        setStatus('error');
        addToast({ message: error.message || "Connection failed", type: "error" });
      }
    };

    connectGHL();
  }, [code, router, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8266D4] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Connecting to GoHighLevel...</h2>
            <p className="text-gray-600">Please wait while we complete the integration.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Connected Successfully!</h2>
            <p className="text-gray-600">Redirecting you back to integrations...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-6">Something went wrong while connecting to GoHighLevel.</p>
            <button 
              onClick={() => {
                const returnUrl = localStorage.getItem('ghl_return_url');
                if (returnUrl) {
                  localStorage.removeItem('ghl_return_url');
                  window.location.href = returnUrl;
                } else {
                  router.push('/dashboard/integration');
                }
              }}
              className="bg-[#8266D4] text-white px-6 py-2 rounded-lg hover:bg-[#6B4FBE] transition-colors"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const GHLCallbackPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
};

export default GHLCallbackPage;
