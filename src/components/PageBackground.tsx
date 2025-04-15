'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const colorCycles = [
  { name: 'light purple', value: 'rgba(200, 150, 255, 0.5)' },
  { name: 'silver', value: 'rgba(192, 192, 192, 0.5)' },
  { name: 'light pink', value: 'rgba(181, 101, 113, 0.5)' },
  { name: 'khaki', value: 'rgba(240, 230, 140, 0.5)' },
  { name: 'light red', value: 'rgba(255, 160, 122, 0.5)' },
  { name: 'bright white', value: 'rgba(255, 255, 255, 0.5)' },
  { name: 'mint green', value: 'rgba(152, 255, 152, 0.5)' },
  { name: 'sky blue', value: 'rgba(135, 206, 235, 0.5)' },
  { name: 'lavender', value: 'rgba(230, 230, 250, 0.5)' },
  { name: 'pale yellow', value: 'rgba(255, 255, 102, 0.5)' },
  { name: 'peach', value: 'rgba(255, 218, 185, 0.5)' },
  { name: 'light turquoise', value: 'rgba(23, 233, 233, 0.5)' },
  { name: 'rose gold', value: 'rgba(248, 188, 178, 0.5)' },
  { name: 'coral', value: 'rgba(255, 127, 80, 0.5)' },
  { name: 'electric blue', value: 'rgba(125, 249, 255, 0.5)' },
  { name: 'pastel violet', value: 'rgba(221, 160, 221, 0.5)' },
  { name: 'aurora pink', value: 'rgba(255, 191, 209, 0.5)' },
  { name: 'neon lime', value: 'rgba(204, 255, 0, 0.4)' },
  { name: 'magic mint', value: 'rgba(170, 240, 209, 0.5)' },
  { name: 'dreamy lilac', value: 'rgba(235, 125, 235, 0.5)' },
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
  const isLumenAIPage = pathname === '/lumenai';
  const gradient = gradients[pathname as keyof typeof gradients] || gradients['/'];
  const [colorIndex, setColorIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(colorCycles[0].value);
  const [nextColor, setNextColor] = useState(colorCycles[1].value);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    if (isLumenAIPage) return; // Skip color transitions for LumenAI page

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
  }, [colorIndex, isLumenAIPage]);

  // Calculate the interpolated color based on transition progress
  const getInterpolatedColor = () => {
    if (isLumenAIPage) return colorCycles[19].value; // Return dreamy lilac for LumenAI page
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
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
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