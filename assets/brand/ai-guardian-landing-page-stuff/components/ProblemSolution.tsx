
import React from 'react';

const ProblemSolution: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-[#1754B5]/20 p-8 rounded-lg border border-blue-900">
          <h3 className="text-2xl font-bold text-white">The Problem: AI is Failing Companies $67.4B Annually</h3>
          <ul className="mt-6 space-y-4 text-gray-300">
            <li><span className="font-bold text-red-400">💸 40-70%</span> of AI spend wasted on inefficient token usage.</li>
            <li><span className="font-bold text-red-400">⚠ $100B</span> market cap lost by Google from one hallucination.</li>
            <li><span className="font-bold text-red-400">📉 46%</span> of developers don't trust AI accuracy.</li>
            <li><span className="font-bold text-red-400">❌ Bias</span> leads to lawsuits, reputation damage, and lost customers.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#33B8FF]">The Solution: AiGuardians</h3>
          <h4 className="text-3xl font-extrabold text-white mt-1">Your Complete AI Safety Platform</h4>
          <p className="mt-4 text-lg text-gray-300">
            We built AiGuardians because we faced these problems ourselves. Five integrated guard services that work together to save money, prevent failures, eliminate bias, maintain context, and secure your AI. One API. One dashboard. Complete protection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
