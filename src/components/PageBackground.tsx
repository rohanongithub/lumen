'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const colorCycles = [
  { name: 'light purple', value: 'rgba(200, 150, 255, 0.5)' },
  { name: 'silver', value: 'rgba(192, 192, 192, 0.5)' },
  { name: 'light pink', value: 'rgba(255, 182, 193, 0.5)' },
  { name: 'khaki', value: 'rgba(240, 230, 140, 0.5)' },
  { name: 'light red', value: 'rgba(255, 160, 122, 0.5)' },
];

const gradients = {
  '/': {
    background: 'linear-gradient(to bottom left, #000000 0%, #000000 100%)',
  },
  '/search': {
    background: 'linear-gradient(to bottom left, #000000 0%, #000000 100%)',
  },
  '/library': {
    background: 'linear-gradient(to bottom left, #000000 0%, #000000 100%)',
  },
  '/playlist': {
    background: 'linear-gradient(to bottom left, #000000 0%, #000000 100%)',
  },
};

export default function PageBackground() {
  const pathname = usePathname();
  const gradient = gradients[pathname as keyof typeof gradients] || gradients['/'];
  const [colorIndex, setColorIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(colorCycles[0].value);
  const [nextColor, setNextColor] = useState(colorCycles[1].value);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    const transitionDuration = 5000; // 5 seconds per color
    const interval = 50; // Update every 50ms for smooth transition
    const steps = transitionDuration / interval;
    const increment = 1 / steps;

    const transitionTimer = setInterval(() => {
      setTransitionProgress((prev) => {
        const newProgress = prev + increment;
        
        if (newProgress >= 1) {
          // Transition complete, move to next color
          const nextIndex = (colorIndex + 1) % colorCycles.length;
          const nextNextIndex = (nextIndex + 1) % colorCycles.length;
          
          setColorIndex(nextIndex);
          setCurrentColor(colorCycles[nextIndex].value);
          setNextColor(colorCycles[nextNextIndex].value);
          return 0;
        }
        
        return newProgress;
      });
    }, interval);

    return () => clearInterval(transitionTimer);
  }, [colorIndex]);

  // Calculate the interpolated color based on transition progress
  const getInterpolatedColor = () => {
    if (transitionProgress === 0) return currentColor;
    
    // Simple linear interpolation between colors
    return `rgba(${interpolateColor(currentColor, nextColor, transitionProgress)})`;
  };

  // Helper function to interpolate between two colors
  const interpolateColor = (color1: string, color2: string, progress: number) => {
    // Extract RGB values from rgba strings
    const rgba1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    const rgba2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    
    if (!rgba1 || !rgba2) return color1;
    
    const r1 = parseInt(rgba1[1]);
    const g1 = parseInt(rgba1[2]);
    const b1 = parseInt(rgba1[3]);
    const a1 = parseFloat(rgba1[4]);
    
    const r2 = parseInt(rgba2[1]);
    const g2 = parseInt(rgba2[2]);
    const b2 = parseInt(rgba2[3]);
    const a2 = parseFloat(rgba2[4]);
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    const a = a1 + (a2 - a1) * progress;
    
    return `${r}, ${g}, ${b}, ${a}`;
  };

  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ background: gradient.background }}
      />
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ 
          background: `
            radial-gradient(circle at top right, ${getInterpolatedColor()} 0%, rgba(0, 0, 0, 0) 50%),
            radial-gradient(circle at bottom left, ${getInterpolatedColor()} 0%, rgba(0, 0, 0, 0) 50%)
          `
        }}
      />
    </div>
  );
} 