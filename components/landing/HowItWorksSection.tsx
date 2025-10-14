'use client';

import React from 'react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Configure Your Agent',
      description: 'Set Up Your AI Agent With Custom Prompts, Voice Styles, And Knowledge Base In Minutes.'
    },
    {
      number: '02',
      title: 'Deploy Instantly',
      description: 'Connect To Your Phone System Or Web App With Our Simple API And Webhook Integrations.'
    },
    {
      number: '03',
      title: 'Scale Automatically',
      description: 'Handle Unlimited Conversations While Monitoring Performance And Optimizing Responses.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-b from-[#41288A] to-[#7659C8] bg-clip-text text-transparent">
            How VELA Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started in minutes, not hours
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-[#8266D4] opacity-30" style={{ top: '2rem' }}></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="relative z-10 mb-8">
                  <div className="w-16 h-16 rounded-full bg-[#04B4C7] flex items-center justify-center shadow-[0px_0px_34.1px_0px_#00CACF80]">
                    <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xl font-medium text-[#41288A]">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
