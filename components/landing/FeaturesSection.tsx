'use client';

import React from 'react';
import Image from 'next/image';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <Image src="/svgs/bolt.svg" alt="Lightning Fast" width={32} height={32} className="object-contain" />
      ),
      title: 'Lightning Fast',
      description: '50ms Response Time For Real-Time Conversations That Feel Natural And Engaging.'
    },
    {
      icon: (
        <Image src="/svgs/brain-circuit.svg" alt="Advanced AI" width={32} height={32} className="object-contain" />
      ),
      title: 'Advanced AI',
      description: 'Powered By Cutting-Edge Language Models With Context-Aware Understanding.'
    },
    {
      icon: (
        <Image src="/svgs/shield.svg" alt="Enterprise Ready" width={32} height={32} className="object-contain" />
      ),
      title: 'Enterprise Ready',
      description: 'SOC 2 Compliant With End-To-End Encryption And Advanced Security Controls.'
    },
    {
      icon: (
        <Image src="/svgs/agent.svg" alt="Multi-Agent Support" width={32} height={32} className="object-contain" />
      ),
      title: 'Multi-Agent Support',
      description: 'Deploy Specialized Agents For Different Use Cases And Customer Touchpoints.'
    },
    {
      icon: (
        <Image src="/svgs/voice-command.svg" alt="Natural Voices" width={32} height={32} className="object-contain" />
      ),
      title: 'Natural Voices',
      description: 'Premium Voice Synthesis With Emotion And Personality Customization.'
    },
    {
      icon: (
        <Image src="/svgs/stats.svg" alt="Deep Analytics" width={32} height={32} className="object-contain" />
      ),
      title: 'Deep Analytics',
      description: 'Comprehensive Insights Into Performance, Usage, And Customer Interactions.'
    }
  ];

  return (
    <section id="features" className="bg-white relative">
      <div className='py-24 bg-[#5B41A80A]'>
        <Image src="/svgs/rings.svg" alt="Feature Background" width={600} height={600} className="object-contain absolute top-0 left-0" />
        <Image src="/svgs/rings2.svg" alt="Feature Background" width={600} height={600} className="object-contain absolute bottom-0 right-0" />
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-[#41288A] to-[#8266D4] bg-clip-text text-transparent">
              Built for Performance
            </h2>
            <p className="text-xl md:text-2xl text-[#4A5565] max-w-3xl mx-auto">
              Everything you need to create exceptional voice AI experiences
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col justify-center items-center relative bg-gradient-to-br from-[#41288A] via-[#8266D4] to-[#A167EC] p-8 rounded-[20px]"
              >
                {/* Icon Container */}
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white text-base leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
