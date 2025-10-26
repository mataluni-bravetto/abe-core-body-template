
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

const ValueProposition: React.FC = () => {
  const [spend, setSpend] = useState(1000);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    // Simple mock calculation: 40% of spend
    const calculatedSavings = spend * 0.4;
    setSavings(calculatedSavings);
  }, [spend]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Built by Developers, for Developers</h2>
          <p className="mt-4 text-lg text-gray-300">
            AiGuardians integrates directly into your workflow. VS Code extensions for BiasGuard and ContextGuard. REST API for everything. Install in 5 minutes. See results immediately.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center"><CheckCircleIcon className="h-6 w-6 text-[#33B8FF] mr-3" /><span>GitHub integration ready</span></li>
            <li className="flex items-center"><CheckCircleIcon className="h-6 w-6 text-[#33B8FF] mr-3" /><span>API-first architecture</span></li>
            <li className="flex items-center"><CheckCircleIcon className="h-6 w-6 text-[#33B8FF] mr-3" /><span>&lt;100ms response time</span></li>
            <li className="flex items-center"><CheckCircleIcon className="h-6 w-6 text-[#33B8FF] mr-3" /><span>Works with OpenAI, Anthropic, and custom LLMs</span></li>
          </ul>
           <a href="#" className="mt-8 inline-block bg-transparent border-2 border-[#33B8FF] text-[#33B8FF] font-bold px-8 py-3 rounded-md text-lg hover:bg-[#33B8FF] hover:text-[#081C3D] transition-all">
            View Documentation &rarr;
          </a>
        </div>
        <div className="bg-[#0E326C] p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white">Calculate Your Savings</h3>
          <div className="mt-6">
            <label htmlFor="ai-spend" className="block text-sm font-medium text-gray-300">Current monthly AI spend:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">$</span>
              </div>
              <input 
                type="number" 
                name="ai-spend" 
                id="ai-spend" 
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-600 bg-[#081C3D] rounded-md py-2 text-white"
                placeholder="1000"
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-6 border-t border-blue-800 pt-6">
            <p className="text-gray-300">Estimated monthly savings (TokenGuard):</p>
            <p className="text-4xl font-extrabold text-[#33B8FF]">${savings.toLocaleString()}</p>
            <p className="text-gray-300 mt-2">Annual ROI: <span className="font-bold text-white">~480%</span></p>
          </div>
           <a href="#" className="mt-6 w-full text-center block bg-[#33B8FF] text-[#081C3D] font-bold px-8 py-3 rounded-md text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
            Start Saving Now &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
