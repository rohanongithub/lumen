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