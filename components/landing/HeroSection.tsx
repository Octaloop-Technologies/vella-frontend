'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Waveform from '../icons/Waveform';

const HeroSection: React.FC = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#F7F7F7] pt-20 lg:pt-20">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[1000px] bg-[#00CACF] rounded-full blur-[150px] opacity-35"></div>
                <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[1000px] bg-[#A167EC] rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-5 sm:space-y-6 md:space-y-7">
                    {/* Beta Badge */}
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm md:text-base text-black font-medium">Now in Beta — Join the Voice AI Revolution</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[82px] font-bold text-[#0966BD] leading-tight">
                        Meet VELA
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl md:text-2xl text-black leading-relaxed max-w-xl">
                        Your AI-Powered Voice + Chat Automation Engine <br className="hidden sm:block" /> Light, Fast and Designed to Scale.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto lg:w-[250px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium text-sm sm:text-base shadow-card transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                Start Building Free
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto lg:w-[250px] px-6 sm:px-8 py-3 sm:py-4 bg-white backdrop-blur-sm text-[#41288A] rounded-lg font-medium text-sm sm:text-base hover:bg-white shadow-card flex items-center justify-center gap-2">
                            Watch Demo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 pt-6 sm:pt-8">
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-4 py-3 sm:py-4 rounded-xl border border-gray-100 shadow-card min-w-[150px]">
                            <div className="text-base sm:text-lg font-bold text-[#099BBD]">99.9%</div>
                            <div className="text-xs sm:text-sm text-black mt-0.5">Uptime</div>
                        </div>
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-4 py-3 sm:py-4 rounded-xl border border-gray-100 shadow-card min-w-[150px]">
                            <div className="text-base sm:text-lg font-bold text-[#099BBD]">50ms</div>
                            <div className="text-xs sm:text-sm text-black mt-0.5">Response Time</div>
                        </div>
                        <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm px-4 py-3 sm:py-4 rounded-xl border border-gray-100 shadow-card min-w-[150px]">
                            <div className="text-base sm:text-lg font-bold text-[#099BBD]">24/7</div>
                            <div className="text-xs sm:text-sm text-black mt-0.5">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Bird Illustration with Waveform */}
                <div className="relative flex items-end justify-center w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full mt-8 lg:mt-0">
                    {/* Waveform Background */}
                    <Waveform className="absolute -bottom-12 sm:-bottom-16 md:-bottom-24 w-full scale-75 sm:scale-90 md:scale-100" />

                    {/* Bird Illustration with Float Animation */}
                    <Image
                        src="/svgs/bird2.svg"
                        alt="Bird Illustration"
                        width={300}
                        height={300}
                        className="absolute object-contain top-8 sm:top-12 md:top-16 -right-8 bird-float z-10 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[400px] h-auto"
                    />

                    <div className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-[#CDEFF0] rounded-full opacity-35"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;