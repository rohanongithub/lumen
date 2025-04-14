'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { HomeIcon, MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTransition } from './TransitionProvider';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Favorites', href: '/favorites', icon: HeartIcon },
  { name: 'Community', href: '/community', icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="url(#radialGradient)" className="w-6 h-6">
      <defs>
        <radialGradient id="radialGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FF69B4" /> {/* Pink */}
          <stop offset="50%" stopColor="#FFD700" /> {/* Yellow */}
          <stop offset="100%" stopColor="#87CEEB" /> {/* Light Blue */}
        </radialGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )},
];

// Custom link component with transition
function TransitionLink({ href, children, className, ariaLabel }: { 
  href: string; 
  children: React.ReactNode; 
  className: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only animate if navigating to a different page
    if (href !== pathname) {
      // Signal to parent components that a navigation is happening
      const transitionEvent = new CustomEvent('pageTransition', { 
        detail: { to: href } 
      });
      window.dispatchEvent(transitionEvent);
      
      // Navigate after giving time for animation
      setTimeout(() => {
        router.push(href);
      }, 400);
    }
  };
  
  return (
    <a 
      href={href}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = useTransition();

  // Custom link handler with transition
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Skip if we're already on this page
    if (href === pathname) return;
    
    // Start the transition and navigate when animation completes
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap');
        
        .shadows-into-light-two {
          font-family: "Shadows Into Light Two", cursive;
          font-weight: 400;
          font-style: normal;
        }

        .rainbow-gradient {
          background: linear-gradient(
            45deg,
            #ff0000,
            #ff8000,
            #ffff00,
            #00ff00,
            #00ffff,
            #0000ff,
            #8000ff
          );
          background-size: 400% 400%;
          animation: rainbow 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes rainbow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>

      <div className="fixed left-6 top-4 flex flex-col z-50">
        {/* Navigation Container */}
        <nav 
          className="p-4" 
          aria-label="Main navigation"
        >
          {/* Logo inside nav container */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-normal tracking-wider text-white shadows-into-light-two">LUMEN</h1>
          </div>
          
          <div className="space-y-6 flex flex-col items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(item.href, e)}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                  <span className="absolute left-12 bg-black/70 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.name}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
} 