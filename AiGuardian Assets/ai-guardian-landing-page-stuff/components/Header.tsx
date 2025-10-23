
import React from 'react';
import { Logo } from './Icons';

const Header: React.FC = () => {
  const navItems = ["Products", "Solutions", "Pricing", "Docs", "Company"];

  return (
    <header className="sticky top-0 z-50 bg-[#081C3D]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">AI Guardian</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
             <div className="flex items-center space-x-2">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign In</a>
                <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Start Free</a>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
