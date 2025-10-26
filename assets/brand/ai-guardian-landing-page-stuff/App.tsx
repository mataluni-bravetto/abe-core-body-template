
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import ValueProposition from './components/ValueProposition';
import TrustAndSecurity from './components/TrustAndSecurity';
import ProblemSolution from './components/ProblemSolution';
import UseCases from './components/UseCases';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-[#081C3D] text-[#F9F9F9] font-sans">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <ValueProposition />
        <TrustAndSecurity />
        <ProblemSolution />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
