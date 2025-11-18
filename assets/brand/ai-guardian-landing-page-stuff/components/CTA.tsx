
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-tr from-[#081C3D] via-[#134390] to-[#1C64D9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Ready to Build Better AI?
        </h2>
        <p className="mt-4 text-lg text-gray-200">
          Join developers who are saving 40-70% on AI costs while building more reliable, unbiased, secure AI products.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="w-full sm:w-auto bg-[#33B8FF] text-[#081C3D] font-bold px-8 py-3 rounded-md text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            Start Free (No Credit Card Required) &rarr;
          </a>
          <a
            href="#"
            className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-md text-lg hover:bg-white hover:text-[#081C3D] transition-all"
          >
            Schedule Demo &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
