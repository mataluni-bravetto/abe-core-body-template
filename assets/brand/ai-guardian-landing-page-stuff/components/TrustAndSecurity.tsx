
import React from 'react';

const features = [
  'Data encryption at rest and in transit',
  'SOC 2 (in progress)',
  'Zero data retention policy (optional)',
  'GDPR compliant',
  'API key security with rate limiting',
  'HIPAA-ready architecture',
  'Military-grade threat protection',
  '99.9% uptime SLA (Enterprise)',
];

const TrustAndSecurity: React.FC = () => {
  return (
    <section className="py-20 bg-[#0E326C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Enterprise-Grade Security You Can Trust
          </h2>
        </div>
        <div className="mt-12">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            {features.map((feature) => (
              <li key={feature} className="text-gray-300">
                <span className="text-[#33B8FF] font-bold">✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TrustAndSecurity;
