import React from 'react';
import { BanknotesIcon, ShieldCheckIcon, ScaleIcon, CpuChipIcon, LockClosedIcon } from './Icons';

const benefits = [
  {
    icon: BanknotesIcon,
    headline: 'Save 40-70% on AI Costs',
    body: 'TokenGuard intelligently optimizes your LLM token usage without sacrificing quality. See immediate ROI.',
  },
  {
    icon: ShieldCheckIcon,
    headline: 'Prevent AI Failures',
    body: 'TrustGuard detects 7 critical AI failure patterns including hallucinations, drift, and security theater before they reach production.',
  },
  {
    icon: ScaleIcon,
    headline: 'Eliminate Cognitive Bias',
    body: 'BiasGuard detects 12+ bias types in real-time with 99.7% accuracy. Fair hiring. Better products. Objective analysis.',
  },
  {
    icon: CpuChipIcon,
    headline: 'Maintain Perfect Context',
    body: 'ContextGuard keeps AI conversations coherent with 96% accuracy in drift detection. Better AI products with consistent context.',
  },
  {
    icon: LockClosedIcon,
    headline: 'Military-Grade Security',
    body: 'SecurityGuard protects against AI-specific threats with input sanitization, threat detection, and enterprise-ready compliance.',
  },
];

const Benefits: React.FC = () => {
  return (
    <section className="py-20 bg-[#0E326C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.headline}
              className={`group bg-[#081C3D]/50 p-8 rounded-lg shadow-lg ${index > 2 ? 'lg:col-start-2 lg:last:col-start-auto' : ''} ${benefits.length === 5 && index === 3 ? 'lg:col-start-1 lg:col-end-3' : ''} ${benefits.length === 5 && index === 4 ? 'lg:col-start-3 lg:col-end-4' : ''}  ${benefits.length === 5 ? 'lg:grid-cols-subgrid lg:col-span-2 odd:col-start-1' : ''}`}
            >
              <benefit.icon className="h-10 w-10 text-[#33B8FF] transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-y-1" />
              <h3 className="mt-4 text-xl font-bold text-white">{benefit.headline}</h3>
              <p className="mt-2 text-gray-300">{benefit.body}</p>
              <a href="#" className="mt-4 inline-block font-semibold text-[#33B8FF] hover:text-[#A5C3F3]">
                Learn More &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
