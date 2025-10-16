'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LandingLayoutProps {
    children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen">
            {/* Header/Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <nav className="px-12 py-6 flex items-center justify-between">
                    {/* Logo */}
                    <Image
                        src="/dashboard/png/logo.png"
                        alt="VELA Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                    />

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-14 px-12 py-5 rounded-[50px] bg-[#FFFFFF1A] border border-white/70 backdrop-blur-md">
                        <Link href="#home" className="text-[#41288A] font-medium text-lg hover:text-[#8266D4] transition-colors relative after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-[#41288A] after:rounded-full">
                            Home
                        </Link>
                        <Link href="#about" className="font-medium text-lg">
                            About
                        </Link>
                        <Link href="#blog" className="font-medium text-lg">
                            Blog
                        </Link>
                        <Link href="#careers" className="font-medium text-lg">
                            Careers
                        </Link>
                        <Link href="#contact" className="font-medium text-lg">
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="relative" style={{ background: 'radial-gradient(circle at center 250%, #A167EC 0%, #000000 100%)' }}>
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="md:col-span-1">
                            <div className="flex flex-col gap-3 mb-4">
                                <Image src="/dashboard/png/logo-white.png" alt="Logo" width={60} height={40} className="object-contain" />
                                <span className="text-3xl font-bold text-white">VELA</span>
                            </div>
                            <p className="text-sm text-white mb-6 leading-relaxed">
                                Your AI-Powered Voice Automation Engine — Light, Fast, And Designed To Scale.
                            </p>
                            <div className="flex items-center gap-8">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_138_1962)">
                                            <path d="M12 6.02783C13.1935 6.02783 14.3381 6.50194 15.182 7.34585C16.0259 8.18977 16.5 9.33436 16.5 10.5278V15.7778H13.5V10.5278C13.5 10.13 13.342 9.74848 13.0607 9.46717C12.7794 9.18587 12.3978 9.02783 12 9.02783C11.6022 9.02783 11.2206 9.18587 10.9393 9.46717C10.658 9.74848 10.5 10.13 10.5 10.5278V15.7778H7.5V10.5278C7.5 9.33436 7.97411 8.18977 8.81802 7.34585C9.66193 6.50194 10.8065 6.02783 12 6.02783ZM1.5 6.77783H4.5V15.7778H1.5V6.77783Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 4.52783C3.82843 4.52783 4.5 3.85626 4.5 3.02783C4.5 2.1994 3.82843 1.52783 3 1.52783C2.17157 1.52783 1.5 2.1994 1.5 3.02783C1.5 3.85626 2.17157 4.52783 3 4.52783Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_138_1962">
                                                <rect width="18" height="18" fill="currentColor" transform="translate(0 0.027832)" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </a>
                                <a href="mailto:contact@vela.com" className="text-white">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 7L13.03 12.7C12.71 12.89 12.36 13 12 13C11.64 13 11.29 12.89 10.97 12.7L2 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Product Section */}
                        <div>
                            <h3 className="font-semibold text-sm mb-4 text-white pl-16">Product</h3>
                            <ul className="space-y-3 pl-16">
                                <li><Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#integrations" className="text-sm text-gray-300 hover:text-white transition-colors">Integrations</Link></li>
                                <li><Link href="#api-docs" className="text-sm text-gray-300 hover:text-white transition-colors">API Docs</Link></li>
                                <li><Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        {/* Company Section */}
                        <div>
                            <h3 className="font-semibold text-sm mb-4 text-white">Company</h3>
                            <ul className="space-y-3">
                                <li><Link href="#about" className="text-sm text-gray-300 hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#blog" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="#careers" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter Section */}
                        <div>
                            <h3 className="font-semibold text-sm mb-4 text-white">Stay Updated</h3>
                            <p className="text-sm text-gray-300 mb-4">Get The Latest Updates And Insights</p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2.5 bg-[#EBEBEB] border border-white/20 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-white text-[#41288A] rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white">© 2024 VELA. All Rights Reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="#privacy" className="text-xs font-medium text-white transition-colors">Privacy Policy</Link>
                            <Link href="#terms" className="text-xs font-medium text-white transition-colors">Terms Of Service</Link>
                            <Link href="#cookie" className="text-xs font-medium text-white transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingLayout;