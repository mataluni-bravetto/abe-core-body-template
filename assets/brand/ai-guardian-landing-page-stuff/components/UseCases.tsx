
import React from 'react';

const cases = [
  {
    title: 'Save 67% on AI Costs',
    scenario: 'Mid-size B2B SaaS company spending $30K/month on AI features.',
    solution: 'Integrated TokenGuard.',
    result: '$20K/month savings, 67% cost reduction.',
    roi: '300x in first month.',
  },
  {
    title: 'Eliminate Hiring Bias',
    scenario: 'Tech startup, 150 employees, homogeneous hiring.',
    solution: 'BiasGuard for interview analysis.',
    result: '85% reduction in biased language.',
    roi: 'Better diversity, reduced legal risk.',
  },
  {
    title: 'Improve AI Reliability 94%',
    scenario: 'Customer service platform with AI chatbot hallucinations.',
    solution: 'TrustGuard in production pipeline.',
    result: '94% reduction in AI failures.',
    roi: 'Reduced support costs, better NPS.',
  },
];

const UseCases: React.FC = () => {
  return (
    <section className="py-20 bg-[#0E326C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Real-World Results
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((useCase) => (
            <div key={useCase.title} className="bg-[#081C3D] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#33B8FF]">{useCase.title}</h3>
              <p className="mt-4 text-sm text-gray-400"><span className="font-semibold text-gray-200">Scenario:</span> {useCase.scenario}</p>
              <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-gray-200">Solution:</span> {useCase.solution}</p>
              <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-gray-200">Result:</span> {useCase.result}</p>
              <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-gray-200">ROI:</span> {useCase.roi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
