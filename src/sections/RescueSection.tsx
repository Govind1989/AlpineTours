import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {  Phone, Radio, Plane, AlertTriangle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RescueSectionProps {
  className?: string;
}

const RescueSection: React.FC<RescueSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Main scroll timeline for pinning and parallax
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1, 
        }
      });

      // Background flight illusion
      tl.fromTo(
        bgRef.current,
        { scale: 1.3, xPercent: -5, yPercent: 5 },
        { scale: 1, xPercent: 0, yPercent: -5, ease: 'none' },
        0
      );

      // Entrance of text content
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, ease: 'power2.out' },
        0.1
      );

      tl.fromTo(
        statsRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out' },
        0.3
      );

      // Exit animations
      tl.to(
        contentRef.current,
        { opacity: 0, x: -20, ease: 'power2.in' },
        0.85
      );
      
      tl.to(
        bgRef.current,
        { scale: 1.1, opacity: 0.5, ease: 'power2.in' },
        0.85
      );
      
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rescue"
      className={`section-pinned relative overflow-hidden ${className}`}
    >
      {/* Dynamic Background Image - Flying Illusion */}
      <img
        ref={bgRef}
        src="/Helicopter_rescue.jpg"
        alt="Helicopter Rescue in Himalayas"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlays for Depth and Readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      <div 
        className="absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Content Layer */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh] text-white">
        {/* Headline Block */}
        <div ref={headlineRef} className="max-w-[46vw]">
          {/* Badge */}
          <span className="font-accent text-xs text-accent tracking-[0.2em] uppercase mb-6 block">
            Guardian Skies Readiness
          </span>

          {/* Headline */}
          <h2 
            className="font-heading text-[clamp(36px,5vw,80px)] font-bold text-white leading-[0.9] tracking-[-0.03em] mb-8"
          >
            Safety Without <br />
            <span className="text-accent italic">Compromise</span>
          </h2>

          {/* Description */}
          <div className="space-y-6">
            <p className="font-body text-lg lg:text-xl text-white/80 max-w-md leading-relaxed">
              In the heart of the world's most unforgiving terrain, we believe your ambition should never outpace your security. 
            </p>
            <p className="font-body text-base lg:text-lg text-white/70 max-w-md leading-relaxed">
              Our 24/7 high-altitude rescue infrastructure is not a feature—it is our foundation. With real-time satellite tracking and mountain-rated Eurocopters, we bring an ironclad safety net to every ridge.
            </p>
          </div>

          <button className="mt-10 flex items-center gap-3 px-8 py-4 bg-accent text-white font-accent text-sm font-bold tracking-widest rounded-xl transition-all hover:brightness-110 active:scale-95 group">
            EMERGENCY PROTOCOLS
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Safety Stats/Features Grid */}
        <div 
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl"
        >
          {[
            { icon: Radio, title: "Satellite Comms", text: "Global Coverage" },
            { icon: Phone, title: "24/7 Dispatch", text: "Instant Response" },
            { icon: Plane, title: "Elite Pilots", text: "Himalayan Vets" },
            { icon: AlertTriangle, title: "Rescue Fleet", text: "Airbus H125" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:border-accent/40 group-hover:-translate-y-2">
                <stat.icon className="w-7 h-7 text-accent" />
              </div>
              <h4 className="font-heading text-xl font-bold text-white mb-2 uppercase tracking-wide">{stat.title}</h4>
              <p className="font-body text-sm text-white/70 leading-relaxed">{stat.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Side Label (Floating Style) */}
      <div className="absolute right-8 bottom-24 z-10 hidden xl:flex flex-col items-end opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-[0.5em] rotate-90 origin-right mb-12 text-white">
          Coordinates Verified
        </span>
        <div className="w-px h-24 bg-white/30" />
      </div>
    </section>
  );
};

export default RescueSection;
