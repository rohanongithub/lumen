'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type TransitionContextType = {
  isTransitioning: boolean;
  startTransition: (callback: () => void) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  startTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [navigationCallback, setNavigationCallback] = useState<(() => void) | null>(null);
  const pathname = usePathname();
  
  // Reset transition state when pathname changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);
  
  // Handle transition completion
  useEffect(() => {
    if (isTransitioning && navigationCallback) {
      const timer = setTimeout(() => {
        navigationCallback();
        setNavigationCallback(null);
      }, 400); // Match your transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, navigationCallback]);
  
  // Start a transition and register the callback
  const startTransition = (callback: () => void) => {
    setIsTransitioning(true);
    setNavigationCallback(() => callback);
  };
  
  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      <div className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </TransitionContext.Provider>
  );
} 