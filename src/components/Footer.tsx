import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-10">
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
  );
} 