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
    <section className="pt-28 pb-36 bg-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[300px] left-0 w-[900px] h-[1000px] bg-[#00CACF] rounded-full blur-[200px] opacity-5"></div>
        <div className="absolute -right-[100px] w-[700px] h-[1000px] bg-[#A167EC] rounded-full blur-[200px] opacity-15"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-b from-[#41288A] to-[#8266D4] bg-clip-text text-transparent">
            How VELA Works
          </h2>
          <p className="text-2xl text-[#4A5565]">
            Get started in minutes, not hours
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-8 h-0.5 bg-[#8266D4] opacity-30" style={{ left: 'calc(100% / 6 + 1rem)', right: 'calc(100% / 6 + 1rem)' }}></div>

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
                <h3 className="text-2xl font-medium text-black mb-4">
                  {step.title}
                </h3>
                <p className="text-black text-lg leading-relaxed max-w-sm">
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
