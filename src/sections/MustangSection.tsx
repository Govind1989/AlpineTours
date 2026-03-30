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
  const bikeContainerRef = useRef<HTMLDivElement>(null);

  // const bikeImages = [
  //   '/bikes/Motorcycle_rotation_frames_Front.jpeg',
  //   '/bikes/Motorcycle_rotation_frames_Right.jpeg',
  //   '/bikes/Motorcycle_rotation_frames_Back.jpeg',
  //   '/bikes/Motorcycle_rotation_frames_Left.jpeg',
  // ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(
        bikeContainerRef.current,
        { x: '55vw', opacity: 0, scale: 0.8, rotateY: -30 },
        { x: 0, opacity: 1, scale: 1, rotateY: 0, ease: 'power2.out' },
        0.05
      );

      scrollTl.fromTo(
        cardRef.current,
        { y: '20vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.15
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.1, x: '-2vw' },
        { scale: 1, x: 0, ease: 'none' },
        0
      );

      // ROTATION (30% - 75%)
      const imgs = bikeContainerRef.current?.querySelectorAll('img');
      if (imgs && imgs.length > 0) {
        scrollTl.to({}, {
          duration: 0.45,
          onUpdate: function() {
            const progress = this.progress();
            // Loop through 0-3 index based on progress
            const index = Math.min(Math.floor(progress * imgs.length), imgs.length - 1);
            imgs.forEach((img, i) => {
              gsap.set(img, { opacity: i === index ? 1 : 0 });
            });
          }
        }, 0.3);
      }

      // EXIT (75% - 100%)
      scrollTl.to(
        headlineRef.current,
        { x: '-15vw', opacity: 0, ease: 'power2.in' },
        0.8
      );

      scrollTl.to(
        bikeContainerRef.current,
        { x: '15vw', opacity: 0, scale: 0.9, ease: 'power2.in' },
        0.8
      );

      scrollTl.to(
        cardRef.current,
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.8
      );

      scrollTl.to(
        bgRef.current,
        { scale: 1.05, x: '2vw', ease: 'none' },
        0.8
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bike-tours"
      className={`section-pinned overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/mustang_valley.jpg"
        alt="Mustang Valley"
        className="bg-image"
      />

      {/* Vignette overlay */}
      <div className="vignette-overlay bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[10vh]">
        {/* Top Section: Headline + Bike Rotation */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          <div ref={headlineRef} className="max-w-[46vw]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="font-accent text-accent tracking-[0.2em] text-sm uppercase">Off-Road Excellence</span>
            </div>
            <h2 className="font-heading text-[clamp(36px,5vw,80px)] font-bold text-white leading-[0.9] tracking-[-0.03em]">
              Conquer the <br />
              <span className="text-accent">High Desert</span>
            </h2>
            <p className="mt-8 font-body text-lg lg:text-xl text-white/80 max-w-md leading-relaxed">
              Dirt, dust, and open sky. Navigate the ancient kingdom of Mustang on two wheels.
            </p>
            
            <div className="mt-10 space-y-4 border-l-2 border-accent/30 pl-6">
              <p className="font-heading text-xl text-white font-medium">
                Best in class for offroading.
              </p>
              <p className="font-body text-base text-white/60 max-w-sm">
                Our machines are engineered to conquer the most challenging Himalayan terrains with unmatched power and precision.
              </p>
            </div>
            {/* Bottom Section: Info Card */}
            <div className="flex justify-end items-end">
              <div
                ref={cardRef}
                className="my-8"
              >
                

                <div className="flex flex-row gap-4">
                  <button className="flex items-center gap-3 px-8 py-4 bg-accent text-white font-accent text-sm font-bold tracking-widest rounded-xl transition-all hover:brightness-110 active:scale-95 group">
                    VIEW ITINERARIES
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-accent text-sm font-bold tracking-widest rounded-xl transition-all hover:bg-white/20 border border-white/10">
                    <Bike className="w-4 h-4" />
                    BIKE SPECS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bike 360 Rotation Container */}
          {/* <div 
            ref={bikeContainerRef} 
            className="relative w-[300px] h-[200px] lg:w-[500px] lg:h-[350px] self-center lg:self-start lg:mt-10"
          >
           
            <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full scale-150" />
            
            <div className="relative w-full h-full glass-card-enhanced rounded-3xl overflow-hidden flex items-center justify-center p-4 border border-white/10 shadow-2xl">
              {bikeImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Bike view ${index}`}
                  className="absolute w-full h-full object-contain transition-opacity duration-100 mix-blend-lighten"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                />
              ))}
              
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-md rounded-[100%]" />
            </div>
            
            
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-white uppercase tracking-[0.2em] font-accent">Scroll to rotate</span>
            </div>
          </div> */}
        </div>

        
      </div>
    </section>
  );
};

export default MustangSection;

