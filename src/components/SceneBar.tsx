import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SceneInfo {
  location: string;
  coordinates: string;
}

const scenes: SceneInfo[] = [
  { location: 'Trek and Bike Tour', coordinates: 'Adventure awaits you' },
  {
    location: 'Beyound Normal Trails', coordinates: 'Guided treks across Nepal highest landscapes.' },
  { location: 'Untouched Remote Trails', coordinates: '29.0469° N, 83.8748° E' },
  { location: 'Kathmandu Valley', coordinates: '27.7172° N, 85.3240° E' },
  { location: 'Langtang Region', coordinates: '28.2154° N, 85.5433° E' },
  { location: 'Everest View Trail', coordinates: '27.8100° N, 86.7200° E' },
  { location: 'Around the World ', coordinates: '27.9500° N, 86.8000° E' },
  { location: 'Gokyo Lakes', coordinates: '27.9500° N, 86.7000° E' },
  { location: 'Kathmandu Office', coordinates: '27.7172° N, 85.3240° E' },
];

const SceneBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const maxScroll = ScrollTrigger.maxScroll(window);
    if (!maxScroll) return;

    const updateScene = () => {
      const scrollY = window.scrollY;
      const progress = scrollY / maxScroll;
      const sceneIndex = Math.min(Math.floor(progress * scenes.length), scenes.length - 1);
      setCurrentScene(sceneIndex);
      
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none',
        });
      }
    };

    window.addEventListener('scroll', updateScene, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateScene);
    };
  }, []);

  const scene = scenes[currentScene];

  return (
    <div
      ref={barRef}
      className="fixed bottom-0 left-0 right-0 h-16 z-[150] flex items-center justify-between px-6 lg:px-[6vw] mb-2"
      style={{
        background: 'linear-gradient(to top, rgba(11, 15, 23, 0.95) 0%, rgba(11, 15, 23, 0.7) 50%, transparent 100%)',
      }}
    >
      {/* Progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          ref={progressRef}
          className="h-full bg-accent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Location info */}
      <div className="flex items-center gap-3">
        <MapPin className="w-4 h-4 text-accent" />
        <div className="flex flex-col">
          <span className="font-accent text-xs tracking-wider text-white/60 uppercase">
            {scene.location}
          </span>
          <span className="font-accent text-[10px] tracking-wider text-white/40">
            {scene.coordinates}
          </span>
        </div>
      </div>

      {/* Navigation indicator */}
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-white/40" />
        <span className="font-accent text-xs tracking-wider text-white/40">
          {String(currentScene + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default SceneBar;
