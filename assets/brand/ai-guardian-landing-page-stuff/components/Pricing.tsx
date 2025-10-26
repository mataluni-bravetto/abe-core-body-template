
import React from 'react';
import { CheckCircleIcon } from './Icons';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    headline: 'Forever Free',
    features: [
      '100 API calls/month per guard',
      '1 user',
      'VS Code extension access',
      'Community support',
    ],
    cta: 'Start Free',
    isPopular: false,
  },
  {
    name: 'Professional',
    price: '$99',
    frequency: '/month',
    headline: 'For Professional Developers',
    features: [
      '1,000 API calls/month per guard',
      '1 user',
      'All VS Code extensions',
      'Priority email support (24-hour response)',
      'Usage analytics',
    ],
    cta: 'Start 14-Day Free Trial',
    isPopular: false,
  },
  {
    name: 'Team',
    price: '$299',
    frequency: '/month',
    headline: 'For Small Teams',
    features: [
      '10,000 API calls/month per guard',
      'Up to 10 users',
      'Team dashboard',
      'Slack integration',
      'Priority support (24-hour response)',
      'Usage tracking & alerts',
    ],
    cta: 'Start Team Trial',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    headline: 'For Large Organizations',
    features: [
      'Unlimited API calls',
      'Unlimited users',
      'Custom deployment options',
      'SSO integration',
      'Dedicated support & SLA guarantees',
      'On-premise option available',
    ],
    cta: 'Schedule Demo',
    isPopular: false,
  },
];

const Pricing: React.FC = () => {
  return (
    <section className="py-20 bg-[#0E326C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col p-8 rounded-2xl shadow-xl ${tier.isPopular ? 'bg-[#1C64D9]' : 'bg-[#081C3D]'}`}>
              {tier.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <span className="bg-[#33B8FF] text-[#081C3D] px-4 py-1 rounded-full text-sm font-semibold">MOST POPULAR</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              <p className="mt-2 text-gray-300">{tier.headline}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                <span className="text-base font-medium text-gray-300">{tier.frequency}</span>
              </div>
              <ul className="mt-6 space-y-4 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-[#33B8FF]" />
                    <span className="ml-3 text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className={`mt-8 block w-full text-center px-6 py-3 rounded-md font-semibold ${tier.isPopular ? 'bg-white text-[#081C3D] hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {tier.cta} &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
