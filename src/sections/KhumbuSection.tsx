import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2 },
        0
      );

      // Headline entrance with split text effect
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          0.3
        );
      }

      // Subheadline entrance
      tl.fromTo(
        subheadlineRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.6
      );

      // Card entrance
      tl.fromTo(
        cardRef.current,
        { x: '8vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8 },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
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
          onLeaveBack: () => {
            // Reset elements when scrolling back to top
            gsap.set([headlineRef.current, subheadlineRef.current], { x: 0, opacity: 1 });
            gsap.set(cardRef.current, { x: 0, opacity: 1 });
            gsap.set(bgRef.current, { scale: 1, y: 0 });
          },
        },
      });

      // ENTRANCE (0% - 30%): Hold at visible state
      // SETTLE (30% - 70%): Hold
      // EXIT (70% - 100%): Animate out

      // Headline exit
      scrollTl.fromTo(
        [headlineRef.current, subheadlineRef.current],
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Card exit
      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Background parallax on exit
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
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/everest_hero.jpg"
        alt="Mount Everest"
        className="bg-image"
      />

      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh]">
        {/* Headline Block */}
        <div className="max-w-[46vw]">
          <h1
            ref={headlineRef}
            className="font-heading text-[clamp(36px,5vw,72px)] font-bold text-white leading-[0.95] tracking-[-0.02em]"
          >
            <span className="word inline-block">Beyond</span>{' '}
            <span className="word inline-block">the</span>{' '}
            <span className="word inline-block">Horizon</span>
          </h1>
          <p
            ref={subheadlineRef}
            className="mt-6 font-body text-lg lg:text-xl text-white/80 max-w-md"
          >
            Guided treks across Nepal's highest landscapes.
          </p>
        </div>

        {/* CTA Card */}
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className="glass-card rounded-xl p-6 lg:p-8 max-w-[520px] w-[34vw] min-w-[300px]"
          >
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-3 uppercase">
              WELCOME TO NEPAL
            </h3>
            <p className="font-body text-sm lg:text-base text-white/70 mb-6">
              Treks, bike tours, cultural journeys, and adventures await you.
            </p>
            <div className='flex flex-row gap-4'>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover group">
              Explore routes
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-accent font-accent text-sm tracking-wider rounded-lg btn-hover group">
                Customize Tours
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
