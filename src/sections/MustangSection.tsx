import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Bike } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MustangSectionProps {
  className?: string;
}

const MustangSection: React.FC<MustangSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bikeIconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: '55vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.08, x: '-4vw' },
        { scale: 1, x: 0, ease: 'none' },
        0
      );

      // Bike icon wobble animation during settle
      scrollTl.fromTo(
        bikeIconRef.current,
        { rotation: -5 },
        { rotation: 5, ease: 'sine.inOut', yoyo: true, repeat: 3 },
        0.3
      );

      // SETTLE (30% - 70%): Hold positions

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.06, x: '3vw', ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bike-tours"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/mustang_valley.jpg"
        alt="Mustang Valley"
        className="bg-image"
      />

      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      {/* Bike icon overlay */}
      <div
        ref={bikeIconRef}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
          <Bike className="w-8 h-8 text-accent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh]">
        {/* Headline Block */}
        <div ref={headlineRef} className="max-w-[46vw]">
          <h2 className="font-heading text-[clamp(32px,4.5vw,64px)] font-bold text-white leading-[0.95] tracking-[-0.02em]">
            Ride the Valley Floor
          </h2>
          <p className="mt-6 font-body text-lg lg:text-xl text-white/80 max-w-md">
            Dirt, dust, and open sky.
          </p>
        </div>

        {/* Info Card */}
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className="glass-card rounded-xl p-6 lg:p-8 max-w-[520px] w-[34vw] min-w-[300px]"
          >
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-3">
              Bike tours
            </h3>
            <p className="font-body text-sm lg:text-base text-white/70 mb-6">
              Descending trails, dramatic walls, and a landscape that changes every hour.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover group">
              View bike itineraries
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MustangSection;
