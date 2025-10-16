'use client';

import React from 'react';
import Image from 'next/image';

const IntegrationsSection: React.FC = () => {
  const integrations = [
    { name: 'Twilio', category: 'Telephony', position: { top: '10%', left: '50%' } },
    { name: 'Open AI', category: 'AI Models', position: { top: '15%', left: '20%' } },
    { name: 'Eleven Labs', category: 'Voice', position: { top: '15%', right: '20%' } },
    { name: 'Slack', category: 'Communication', position: { top: '35%', left: '5%' } },
    { name: 'High Level', category: 'CRM', position: { top: '30%', right: '8%' } },
    { name: 'Stripe', category: 'Payments', position: { bottom: '40%', left: '8%' } },
    { name: 'Discord', category: 'Community', position: { bottom: '35%', right: '10%' } },
    { name: 'N8n', category: 'Workflows', position: { bottom: '25%', left: '3%' } },
    { name: 'HubSpot', category: 'CRM', position: { bottom: '20%', left: '25%' } },
    { name: 'Zapier', category: 'Automation', position: { bottom: '18%', right: '35%' } },
    { name: 'Cal.Com', category: 'Scheduling', position: { bottom: '25%', right: '5%' } },
    { name: 'Salesforce', category: 'CRM', position: { bottom: '5%', left: '50%' } }
  ];

  return (
    <section id="integrations" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute -left-96 w-[900px] h-[1000px] bg-[#00CACF] rounded-full blur-[150px] opacity-10"></div>
      <div className="absolute -right-36 -bottom-36 w-[900px] h-[1000px] bg-[#A167EC] rounded-full blur-[100px] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-6xl py-1 font-bold bg-gradient-to-b from-[#41288A] to-[#8266D4] bg-clip-text text-transparent mb-3">
            Connect Everything
          </h2>
          <p className="text-2xl text-[#4A5565]">
            Seamless integrations with your favorite tools
          </p>
        </div>

        {/* Integration Diagram */}
        <div className="relative max-w-5xl mx-auto">

          <Image src="/svgs/integrations.svg" alt="Integration Lines" width={800} height={800} className="w-full h-full object-contain pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
