import { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start with invisible state
    setIsVisible(false);
    
    // Small delay before showing to ensure proper animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Auto-hide timer
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transform transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0'
      }`}
    >
      <div
        className={`flex items-center space-x-2 rounded-lg px-4 py-3 shadow-lg backdrop-blur-md ${
          type === 'success' 
            ? 'bg-green-500/40 text-white' 
            : 'bg-red-500/40 text-white'
        }`}
      >
        <CheckCircleIcon className="h-5 w-5" />
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
          className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors duration-200"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 