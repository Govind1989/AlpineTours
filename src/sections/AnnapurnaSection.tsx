import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AnnapurnaSectionProps {
  className?: string;
}

const AnnapurnaSection: React.FC<AnnapurnaSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
        { scale: 1.08, y: '6vh' },
        { scale: 1, y: 0, ease: 'none' },
        0
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
        { scale: 1, y: 0 },
        { scale: 1.06, y: '-4vh', ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="routes"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/annapurna_ridge.jpg"
        alt="Annapurna Ridge"
        className="bg-image"
      />

      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh]">
        {/* Headline Block */}
        <div ref={headlineRef} className="max-w-[46vw]">
          <h2 className="font-heading text-[clamp(32px,4.5vw,64px)] font-bold text-white leading-[0.95] tracking-[-0.02em]">
            Walk the Great Ridges
          </h2>
          <p className="mt-6 font-body text-lg lg:text-xl text-white/80 max-w-md">
            From tea-house trails to high passes.
          </p>
        </div>

        {/* Info Card */}
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className="glass-card rounded-xl p-6 lg:p-8 max-w-[520px] w-[34vw] min-w-[300px]"
          >
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-3">
              Annapurna region
            </h3>
            <p className="font-body text-sm lg:text-base text-white/70 mb-6">
              Flexible itineraries, acclimatization built in, and support at every step.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover group">
              See Annapurna routes
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnapurnaSection;
