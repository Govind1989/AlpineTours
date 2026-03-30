import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PlanSectionProps {
  className?: string;
}

const PlanSection: React.FC<PlanSectionProps> = ({ className = '' }) => {
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
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1.06, y: '-4vh', opacity: 0, ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/lakeside_lodge.jpg"
        alt="Lakeside Lodge"
        className="bg-image"
      />

      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh]">
        {/* Headline Block */}
        <div ref={headlineRef} className="max-w-[46vw]">
          <h2 className="font-heading text-[clamp(32px,4.5vw,64px)] font-bold text-white leading-[0.95] tracking-[-0.02em]">
            Start Your Journey
          </h2>
          <p className="mt-6 font-body text-lg lg:text-xl text-white/80 max-w-md">
            Pick a route. Choose a season. We'll handle the rest.
          </p>
        </div>

        {/* Booking Card */}
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className="glass-card rounded-xl p-6 lg:p-8 max-w-[520px] w-[34vw] min-w-[300px]"
          >
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-3">
              Plan your trek
            </h3>
            <p className="font-body text-sm lg:text-base text-white/70 mb-6">
              Tell us your dates, fitness level, and goals. We'll recommend a route and a guide.
            </p>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover group">
                Request a quote
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-accent text-sm tracking-wider rounded-lg hover:bg-white/5 transition-colors">
                <Download className="w-4 h-4" />
                Download gear checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
