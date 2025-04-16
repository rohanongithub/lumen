import { useState, useEffect } from 'react';

interface OnboardingProps {
  onClose: () => void;
}

export default function Onboarding({ onClose }: OnboardingProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Show text immediately
    setTextVisible(true);

    // Automatically close after 3 seconds
    const closeTimer = setTimeout(() => {
      setTextVisible(false); // First hide text
      
      // Then hide background after text fades
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <h2 
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white transition-all duration-500 ${
            textVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}
        >
          Welcome to <span className="shadows-into-light-two">Lumen</span> Sounds
        </h2>
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap');
        
        .shadows-into-light-two {
          font-family: "Shadows Into Light Two", cursive;
          font-weight: 400;
          font-style: normal;
        }

        /* Ensure onboarding shows at all breakpoints */
        @media (max-width: 1040px) {
          /* Force onboarding to be above all other elements */
          [class*="z-[9999]"] {
            z-index: 9999 !important;
            position: fixed !important;
          }
        }
      `}</style>
    </>
  );
}
