
import React from 'react';
import { Logo } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#081C3D] border-t border-blue-900/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
            <a href="#" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">AI Guardian</span>
            </a>
        </div>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-400 hover:text-white">Products</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-400 hover:text-white">Docs</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-400 hover:text-white">Company</a></div>
            <div className="px-5 py-2"><a href="#" className="text-base text-gray-400 hover:text-white">Contact</a></div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-500">
          &copy; 2025 BiasGuards.ai LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
