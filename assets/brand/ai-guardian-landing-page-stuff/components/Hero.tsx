
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#081C3D] via-[#134390] to-[#1C64D9]">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
          AiGuardians: Safe, Reliable, Cost-Effective AI
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-200">
          5 Integrated Services. One Platform. Complete AI Governance.
          Save 40-70% on AI costs. Prevent hallucinations. Eliminate bias.
          Maintain context. Secure your AI.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="w-full sm:w-auto bg-[#33B8FF] text-[#081C3D] font-bold px-8 py-3 rounded-md text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            Start Free &rarr;
          </a>
          <a
            href="#"
            className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-md text-lg hover:bg-white hover:text-[#081C3D] transition-all"
          >
            Book Demo &rarr;
          </a>
        </div>
        <p className="mt-12 text-sm text-gray-400">
          Trusted by developers at leading tech companies.
        </p>
      </div>
    </section>
  );
};

export default Hero;
