'use client';

import { useEffect, useState } from 'react';
import Orb from '@/components/Orb';
import TrackList from '@/components/TrackList';

export default function LumenAIPage() {
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showOrb, setShowOrb] = useState(true);
  const [orbOpacity, setOrbOpacity] = useState(1);
  const [showTracks, setShowTracks] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowFirstText(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowFirstText(false);
    }, 4000);

    const timer3 = setTimeout(() => {
      setShowSecondText(true);
    }, 5000);

    const timer4 = setTimeout(() => {
      setShowSecondText(false);
    }, 8000);

    const timer5 = setTimeout(() => {
      setShowButton(true);
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const handleSurpriseMe = () => {
    setOrbOpacity(0);
    setShowButton(false);
    
    // Wait for the fade-out transition to complete before removing the Orb and showing tracks
    setTimeout(() => {
      setShowOrb(false);
      setShowTracks(true);
    }, 1000); // Match the transition duration
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-[800px] flex-1">
        {showOrb && (
          <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: orbOpacity }}>
            <Orb hoverIntensity={3.35} rotateOnHover={true} hue={332} forceHoverState={false} />
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none">
          <h1 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-white transition-opacity duration-500 ${
              showFirstText ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
          >
            Welcome to LumenAI
          </h1>
          <h1 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-white transition-opacity duration-500 ${
              showSecondText ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
          >
            Don't know what to listen?
          </h1>
        </div>
        {showButton && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 z-20">
            <button
              onClick={handleSurpriseMe}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-normal text-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] border border-white/30"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            >
              Surprise Me
            </button>
          </div>
        )}
        {showTracks && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TrackList />
          </div>
        )}
      </div>
      {/* Minimalistic Footer */}
      <footer className="w-full py-6">
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Lumen Sounds. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Terms</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Help</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 