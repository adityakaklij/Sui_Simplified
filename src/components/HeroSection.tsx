import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-map-terrain-light dark:bg-map-terrain-dark p-8 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark -rotate-2 mb-16">
      <div className="text-center max-w-3xl mx-auto rotate-2">
        {/* <h1 className="text-4xl font-black tracking-tight text-white dark:text-black sm:text-5xl md:text-6xl text-outline-dark dark:text-outline-white uppercase">Your Sui Quest Log!</h1> */}
        <h1 className="text-4xl font-black tracking-tight text-white dark:text-black sm:text-5xl md:text-6xl text-outline-dark dark:text-outline-white uppercase">SUI  TRANSACTION  DECODED</h1>
        <p className="mt-4 text-lg font-semibold text-white/90 dark:text-black/80">Embark on your journey: paste a transaction code to reveal the map!</p>
      </div>
    </div>
  );
};

export default HeroSection;

