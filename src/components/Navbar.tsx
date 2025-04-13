'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Library', href: '/library', icon: BookOpenIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full flex flex-col p-6 z-50">
      {/* Spacer to maintain navbar position */}
      <div className="mb-auto">
        <div className="h-8"></div> {/* Invisible spacer to maintain layout */}
      </div>

      {/* Navigation Container */}
      <nav 
        className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-lg" 
        aria-label="Main navigation"
      >
        {/* Logo inside nav container */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold tracking-wider text-white">LUMEN</h1>
        </div>
        
        <div className="space-y-6 flex flex-col items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
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
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Bottom spacer for vertical centering */}
      <div className="mt-auto" />
    </div>
  );
} 