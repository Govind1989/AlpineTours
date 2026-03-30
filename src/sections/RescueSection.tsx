import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Phone, Radio, Plane, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RescueSectionProps {
  className?: string;
}

const RescueSection: React.FC<RescueSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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
          scrub: 1, // Smoother scrub for flying feel
        }
      });

      // Background flight illusion: 
      // Moves from slightly zoomed in and offset to centered/normal
      tl.fromTo(
        bgRef.current,
        { scale: 1.3, xPercent: -5, yPercent: 5 },
        { scale: 1, xPercent: 0, yPercent: -5, ease: 'none' },
        0
      );

      // Entrance of text content
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: 'power2.out' },
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
        { opacity: 0, scale: 0.95, y: -20, ease: 'power2.in' },
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
      className={`section-pinned relative overflow-hidden flex items-center justify-center ${className}`}
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
      <div ref={contentRef} className="relative z-10 w-full max-w-7xl px-6 lg:px-12 text-center text-white">
        <div className="flex flex-col items-center">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs uppercase tracking-[0.2em] font-accent">
            <Shield className="w-3.5 h-3.5 text-accent" />
            Guardian Skies Readiness
          </div>

          {/* Headline */}
          <h2 
            ref={titleRef}
            className="font-heading text-[clamp(40px,6vw,96px)] font-bold leading-[0.9] tracking-[-0.03em] mb-8"
          >
            Safety Without <br />
            <span className="text-accent italic">Compromise</span>
          </h2>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="font-body text-lg lg:text-xl text-white/80 leading-relaxed">
              In the heart of the world's most unforgiving terrain, we believe your ambition should never outpace your security. 
              Our 24/7 high-altitude rescue infrastructure is not a feature—it is our foundation.
            </p>
            <p className="font-body text-base lg:text-lg text-white/60">
              With real-time satellite tracking and a dedicated fleet of mountain-rated Eurocopters, 
              we bring an ironclad safety net to every ridge and valley of your journey.
            </p>
          </div>

          {/* Safety Stats/Features Grid */}
          <div 
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 w-full"
          >
            {[
              { icon: Radio, title: "Satellite Comms", text: "Global Coverage" },
              { icon: Phone, title: "24/7 Dispatch", text: "Instant Response" },
              { icon: Plane, title: "Elite Pilots", text: "Himalayan Vets" },
              { icon: AlertTriangle, title: "Rescue Fleet", text: "Airbus H125" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:border-accent/40 group-hover:-translate-y-2">
                  <stat.icon className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-heading text-lg font-semibold mb-1">{stat.title}</h4>
                <p className="font-body text-sm text-white/40">{stat.text}</p>
              </div>
            ))}
          </div>
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
