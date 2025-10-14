import React from 'react';
import LandingLayout from '@/components/landing/LandingLayout';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyChooseSection from '@/components/landing/WhyChooseSection';
import IntegrationsSection from '@/components/landing/IntegrationsSection';

export default function Home() {
  return (
    <LandingLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <IntegrationsSection />
    </LandingLayout>
  );
}
