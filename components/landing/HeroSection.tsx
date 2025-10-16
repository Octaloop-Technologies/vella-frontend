'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Waveform from '../icons/Waveform';

const HeroSection: React.FC = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#F7F7F7]">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[1000px] bg-[#00CACF] rounded-full blur-[150px] opacity-35"></div>
                <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[1000px] bg-[#A167EC] rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-7">
                    {/* Beta Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-base text-black font-medium">Now in Beta — Join the Voice AI Revolution</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-[82px] font-bold text-[#099BBD] leading-tight">
                        Meet VELA
                    </h1>

                    {/* Description */}
                    <p className="text-2xl text-black leading-relaxed max-w-xl">
                        Your AI-powered voice automation engine light, fast, and designed to scale.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/signup">
                            <button className="px-8 py-4 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium text-base shadow-card transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                Start Building Free
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </Link>
                        <button className="px-8 py-4 bg-white backdrop-blur-sm text-[#41288A] rounded-lg font-medium text-base hover:bg-white shadow-card flex items-center gap-2">
                            Watch Demo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap gap-4 pt-8">
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-100 shadow-card">
                            <div className="text-lg font-bold text-[#099BBD]">99.9%</div>
                            <div className="text-sm text-black mt-0.5">Uptime</div>
                        </div>
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-100 shadow-card">
                            <div className="text-lg font-bold text-[#099BBD]">50ms</div>
                            <div className="text-sm text-black mt-0.5">Response Time</div>
                        </div>
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-100 shadow-card">
                            <div className="text-lg font-bold text-[#099BBD]">24/7</div>
                            <div className="text-sm text-black mt-0.5">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Bird Illustration with Waveform */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {/* Waveform Background */}

                    {/* <Image src="/svgs/waveform.svg" alt="Waveform Background" width={400} height={400} className="absolute inset-0 w-full h-full object-contain" /> */}
                    <Waveform />

                    {/* Bird Illustration with Float Animation */}
                    <Image
                        src="/svgs/bird2.svg"
                        alt="Bird Illustration"
                        width={300}
                        height={300}
                        className="absolute object-contain -top-28 right-12 bird-float z-10"
                    />

                    <div className="absolute -top-32 right-0 w-32 h-32 bg-[#CDEFF0] rounded-full opacity-35"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
