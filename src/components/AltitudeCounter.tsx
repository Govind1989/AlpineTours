import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AltitudeCounter: React.FC = () => {
  const counterRef = useRef<HTMLDivElement>(null);
  const [altitude, setAltitude] = useState(1400);

  useEffect(() => {
    const maxScroll = ScrollTrigger.maxScroll(window);
    if (!maxScroll) return;

    const updateAltitude = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / maxScroll, 1);
      const newAltitude = Math.round(1400 + progress * (8848 - 1400));
      setAltitude(newAltitude);
    };

    window.addEventListener('scroll', updateAltitude, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateAltitude);
    };
  }, []);

  return (
    <div
      ref={counterRef}
      className="fixed top-1/2 right-6 -translate-y-1/2 z-[200] hidden lg:flex flex-col items-center gap-2"
    >
      <div className="font-accent text-xs tracking-[0.2em] text-white/40 uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
        Altitude
      </div>
      <div className="w-px h-16 bg-white/20 relative">
        <div 
          className="absolute bottom-0 left-0 w-full bg-accent transition-all duration-300"
          style={{ height: `${((altitude - 1400) / (8848 - 1400)) * 100}%` }}
        />
      </div>
      <div className="font-accent text-sm font-bold text-white/80" style={{ writingMode: 'vertical-rl' }}>
        {altitude.toLocaleString()}m
      </div>
    </div>
  );
};

export default AltitudeCounter;
