'use client';

import React from 'react';
import Image from 'next/image';

const WhyChooseSection: React.FC = () => {
  const benefits = [
    {
      icon: (
        <Image src="/svgs/clock.svg" alt="24/7 Availability" width={24} height={24} className="object-contain" />
      ),
      title: '24/7 Availability',
      description: 'Never miss a call or inquiry with round-the-clock voice assistance'
    },
    {
      icon: (
        <Image src="/svgs/surge.svg" alt="Cost-Effectiveness" width={24} height={24} className="object-contain" />
      ),
      title: 'Cost-Effectiveness',
      description: 'Reduce operational costs while maintaining high-quality customer service'
    },
    {
      icon: (
        <Image src="/svgs/chart.svg" alt="Scalability" width={24} height={24} className="object-contain" />
      ),
      title: 'Scalability',
      description: 'Handle unlimited conversations simultaneously without additional overhead'
    },
    {
      icon: (
        <Image src="/svgs/lightning.svg" alt="Improved Efficiency" width={24} height={24} className="object-contain" />
      ),
      title: 'Improved Efficiency',
      description: 'Automate routine tasks and focus your team on high-value activities'
    },
    {
      icon: (
        <Image src="/svgs/brain.svg" alt="Natural Understanding" width={24} height={24} className="object-contain" />
      ),
      title: 'Natural Understanding',
      description: 'Advanced AI comprehends context and intent for natural conversations'
    },
    {
      icon: (
        <Image src="/svgs/users.svg" alt="Personalized Interactions" width={24} height={24} className="object-contain" />
      ),
      title: 'Personalized Interactions',
      description: 'Tailor responses based on customer data and conversation history'
    }
  ];

  return (
    <section className="py-20 bg-black relative overflow-hidden" style={{ background: 'radial-gradient(circle at center 150%, #A167EC 0%, #000000 100%)' }}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-4">
            Why Choose VELA
          </h2>
          <p className="text-2xl text-white max-w-3xl mx-auto">
            Transform your business communications with intelligent voice automation
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-[#F3F4F6] backdrop-blur-sm p-8 rounded-2xl border border-[#F3F4F6]"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#41288A] to-[#7659C8] rounded-2xl flex items-center justify-center mb-4 shadow-[0px_10px_15px_-3px_#0000001A]">
                <div className="text-white">
                  {benefit.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#101828] mb-3">
                {benefit.title}
              </h3>
              <p className="text-[#4A5565] text-base">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
