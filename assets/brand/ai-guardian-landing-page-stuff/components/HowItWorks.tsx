
import React from 'react';

const steps = [
  {
    number: '01',
    headline: 'Sign Up Free',
    body: 'Create your account in 60 seconds. No credit card required. Start with 100 API calls/month per guard.',
  },
  {
    number: '02',
    headline: 'Integrate Your AI',
    body: 'Simple REST API or VS Code extension. Copy your API key, add 3 lines of code, and you\'re protected.',
  },
  {
    number: '03',
    headline: 'Save Money & Sleep Better',
    body: 'Watch your AI costs drop 40-70%. Catch failures before users do. Build AI products you can be proud of.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Get Started in 3 Simple Steps
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="absolute -top-4 -left-4 text-6xl font-black text-blue-800/50 -z-0">{step.number}</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#33B8FF]">{step.headline}</h3>
                <p className="mt-2 text-gray-300">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
