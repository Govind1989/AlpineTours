import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import './App.css';

// Sections
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import AnnapurnaSection from './sections/AnnapurnaSection';
import MustangSection from './sections/MustangSection';
// import CulturalSection from './sections/CulturalSection';
import WinterSection from './sections/WinterSection';
// import GroupSection from './sections/GroupSection';
import RescueSection from './sections/RescueSection';
import TestimonialSection from './sections/TestimonialSection';
// import PlanSection from './sections/PlanSection';
import FooterSection from './sections/FooterSection';

// Components
import AltitudeCounter from './components/AltitudeCounter';
import SceneBar from './components/SceneBar';
import GrainOverlay from './components/GrainOverlay';
import DraggableTourCards from './sections/DraggableTourCards';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global snap configuration for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay snap setup to ensure all ScrollTriggers are created
    const snapTimeout = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(snapTimeout);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-alpine-dark">
      {/* Grain overlay */}
      <GrainOverlay />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Altitude Counter */}
      <AltitudeCounter />
      
      {/* Main content */}
      <main className="relative">
        <HeroSection className="z-10" />
        <AnnapurnaSection className="z-20" />
        {/* <KhumbuSection className="z-25" /> */}
        <MustangSection className="z-30" />
        {/* <CulturalSection className="z-40" /> */}
        <WinterSection className="z-50" />
        {/* <GroupSection className="z-[60]" /> */}
        <RescueSection className="z-[60]" />
        <TestimonialSection className="z-[70]" />
        {/* <PlanSection className="z-[80]" /> */}
        <DraggableTourCards className="z-[80]" />
        <FooterSection className="z-[90]" />
      </main>
      
      {/* Scene Bar */}
      <SceneBar />
    </div>
  );
}

export default App;
