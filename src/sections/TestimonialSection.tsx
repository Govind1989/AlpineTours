import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ArrowRight, Quote, MapPin, Star, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialSectionProps {
  className?: string;
}

interface Testimonial {
  id: string;
  name: string;
  country: string;
  location: { x: number; y: number }; // Percentage positions on map
  avatar: string;
  rating: number;
  text: string;
  tour: string;
  date: string;
  flag: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    country: 'Nepal',
    location: { x: 74, y: 42 }, 
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    text: "The Annapurna Circuit changed my perspective on everything. Our guide Raj was incredible—he knew every trail, every tea house, and every story. The mountains don't care who you are, but they reward those who respect them.",
    tour: 'Annapurna Circuit Trek',
    date: 'March 2026',
    flag: '🇳🇵'
  },
  {
    id: '2',
    name: 'Marcus Weber',
    country: 'Argentina',
    location: { x: 28, y: 82 },
    avatar: '/avatars/marcus.jpg',
    rating: 5,
    text: "I've hiked the Alps, the Rockies, and the Himalayas—but nothing prepared me for the raw power of Patagonia. Alpine Outdoor handled every detail perfectly.",
    tour: 'Patagonia Wilderness',
    date: 'February 2026',
    flag: '🇦🇷'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    country: 'Iceland',
    location: { x: 44, y: 18 },
    avatar: '/avatars/emma.jpg',
    rating: 5,
    text: "Walking across volcanic landscapes while the northern lights danced above us—this wasn't just a trek, it was a pilgrimage. The Laugavegur Trail is otherworldly.",
    tour: 'Laugavegur Trail',
    date: 'January 2026',
    flag: '🇮🇸'
  },
  {
    id: '4',
    name: 'Hiroshi Tanaka',
    country: 'Tanzania',
    location: { x: 58, y: 62 },
    avatar: '/avatars/hiroshi.jpg',
    rating: 5,
    text: "Summit night was the hardest thing I've ever done. But standing on the roof of Africa at sunrise, watching the shadow of the mountain stretch across the clouds—worth every step.",
    tour: 'Kilimanjaro Summit',
    date: 'December 2025',
    flag: '🇹🇿'
  },
  {
    id: '5',
    name: 'Isabella Romano',
    country: 'Italy',
    location: { x: 50, y: 28 },
    avatar: '/avatars/isabella.jpg',
    rating: 5,
    text: "The Dolomites are where geology becomes art. Our via ferrata experience was thrilling but always felt safe. The rifugios, the food, the camaraderie—bellissimo!",
    tour: 'Dolomites Traverse',
    date: 'November 2025',
    flag: '🇮🇹'
  },
  {
    id: '6',
    name: 'James Morrison',
    country: 'Peru',
    location: { x: 26, y: 58 },
    avatar: '/avatars/james.jpg',
    rating: 5,
    text: "The Inca Trail to Machu Picchu was bucket list material, but it was the lesser-known paths our guides took us on that truly stole my heart. Ancient ruins without the crowds.",
    tour: 'Inca Trail Expedition',
    date: 'October 2025',
    flag: '🇵🇪'
  },
  {
    id: '7',
    name: 'Yuki Sato',
    country: 'Japan',
    location: { x: 88, y: 35 },
    avatar: '/avatars/yuki.jpg',
    rating: 5,
    text: "Mount Fuji is home, but the sheer scale of the Annapurna Sanctuary left me breathless. The contrast between the lush forests and the towering white peaks is something I will never forget.",
    tour: 'Annapurna Sanctuary',
    date: 'April 2026',
    flag: '🇯🇵'
  }
];

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Track open testimonials (Clicked Only)
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleTestimonial = (id: string) => {
    setActiveIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const closeTestimonial = (id: string) => {
    setActiveIds(prev => prev.filter(item => item !== id));
  };

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

      scrollTl.fromTo('.map-image-wrapper', { opacity: 0, scale: 1.05 }, { opacity: 0.45, scale: 1, duration: 1 }, 0);
      scrollTl.fromTo(pinsRef.current, { y: -20, opacity: 0, scale: 0 }, { y: 0, opacity: 1, scale: 1, stagger: 0.08, ease: 'back.out(2)' }, 0.2);
      scrollTl.fromTo('.map-title-block', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.1);

      pinsRef.current.forEach((pin, index) => {
        if (!pin) return;
        gsap.to(pin.querySelector('.pin-pulse'), { scale: 2.5, opacity: 0, duration: 2, repeat: -1, delay: index * 0.3, ease: 'sine.out' });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Spatial Awareness Animation Logic
  useEffect(() => {
    testimonials.forEach((t, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      const isActive = activeIds.includes(t.id);
      
      if (isActive) {
        // High-end spatial tilt: card leans away from the pin center
        const rotateX = t.location.y > 50 ? -8 : 8;
        const rotateY = t.location.x > 50 ? 8 : -8;

        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX,
          rotateY,
          duration: 0.6,
          pointerEvents: 'auto',
          zIndex: 200 + i,
          ease: 'back.out(1.2)',
          overwrite: true
        });
      } else {
        gsap.to(card, {
          opacity: 0,
          y: 30,
          scale: 0.9,
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          pointerEvents: 'none',
          zIndex: 10,
          ease: 'power3.in',
          overwrite: true
        });
      }
    });
  }, [activeIds]);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned relative overflow-hidden bg-slate-950 ${className}`}
    >
      {/* Background Polish */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]" />

      {/* Interactive Map Layer (Elevated to ensure no blocking) */}
      <div ref={mapContainerRef} className="absolute inset-0 flex items-center justify-center p-[6vw] lg:p-[8vw] z-30 pointer-events-none">
        <div className="relative w-full aspect-[2/1] max-w-[1400px]">
          
          {/* Detailed World Map Backdrop */}
          <div className="map-image-wrapper absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
            <img src="/worldmap.jpg" alt="World Map" className="w-full h-full object-contain scale-110" />
          </div>

          {/* Dynamic Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path 
              d="M74,42 Q50,20 28,82 M28,82 Q35,65 26,58 M26,58 Q40,40 50,28 M50,28 Q47,23 44,18 M44,18 Q55,40 58,62 M58,62 Q65,48 74,42 M74,42 Q80,38 88,35"
              fill="none"
              stroke="rgba(255, 77, 46, 0.2)"
              strokeWidth="0.1"
              strokeDasharray="1,2"
            />
          </svg>

          {/* Pins - Pointer events auto to allow clicks */}
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              ref={(el) => { pinsRef.current[index] = el; }}
              onMouseEnter={() => setHoveredId(testimonial.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => { e.stopPropagation(); toggleTestimonial(testimonial.id); }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-50 cursor-pointer outline-none pointer-events-auto"
              style={{
                left: `${testimonial.location.x}%`,
                top: `${testimonial.location.y}%`
              }}
            >
              <div className="pin-pulse absolute inset-0 rounded-full bg-accent/40 w-14 h-14 -m-2" />
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-500 transform border-2
                ${activeIds.includes(testimonial.id)
                  ? 'bg-accent scale-125 border-white shadow-[0_0_40px_rgba(255,77,46,1)]'
                  : 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:scale-110'
                }
              `}>
                <MapPin className={`w-5 h-5 ${activeIds.includes(testimonial.id) ? 'text-white' : 'text-white/80'}`} />
              </div>

              {/* Minimal Tooltip */}
              <div className={`
                absolute top-full left-1/2 -translate-x-1/2 mt-4
                whitespace-nowrap px-4 py-1.5 rounded-full
                bg-white/5 backdrop-blur-xl border border-white/10 
                font-accent text-[10px] font-bold tracking-[0.2em] text-white uppercase
                transition-all duration-300 pointer-events-none
                ${hoveredId === testimonial.id || activeIds.includes(testimonial.id) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
              `}>
                {testimonial.flag} {testimonial.country}
              </div>
            </button>
          ))}

          {/* Testimonial Cards Overlay - Spatially Aware Positioning */}
          <div className="absolute inset-0 pointer-events-none z-[100]">
            {testimonials.map((testimonial, index) => {
              // ADVANCED SPATIAL AWARENESS LOGIC
              // Decides whether card opens Left/Right and Top/Bottom to stay in viewport
              const xPos = testimonial.location.x;
              const yPos = testimonial.location.y;
              
              let translateX = '15%'; // Default open right
              let translateY = '15%'; // Default open down
              
              if (xPos > 70) translateX = '-115%'; // Far right -> open left
              else if (xPos > 50) translateX = '-105%'; // Mid right -> open left
              
              if (yPos > 75) translateY = '-115%'; // Near bottom -> open way up
              else if (yPos > 55) translateY = '-105%'; // Mid bottom -> open up
              else if (yPos < 25) translateY = '10%'; // Near top -> open down

              return (
                <div
                  key={`card-${testimonial.id}`}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="absolute w-[400px] max-w-[90vw] opacity-0 pointer-events-none perspective-[1200px]"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: `translate(${translateX}, ${translateY})`
                  }}
                >
                  <div className="glass-card rounded-[2rem] p-8 lg:p-10 border border-white/20 backdrop-blur-3xl bg-slate-900/90 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative pointer-events-auto overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
                    
                    {/* Explicit Close Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); closeTestimonial(testimonial.id); }}
                      className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all cursor-pointer group z-50 border border-white/10"
                    >
                      <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                    </button>

                    {/* Card Content (Hero-Consistent Typography) */}
                    <div className="flex items-start gap-6 mb-10">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-accent/40 shadow-2xl shrink-0 rotate-3 transition-transform hover:rotate-0">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-wide truncate">
                          {testimonial.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">{testimonial.flag}</span>
                          <p className="font-accent text-xs text-accent tracking-[0.2em] uppercase truncate">{testimonial.tour}</p>
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative mb-10">
                      <Quote className="absolute -top-6 -left-4 w-12 h-12 text-white/5" />
                      <p className="font-body text-lg lg:text-xl text-white/90 leading-relaxed italic pl-8 border-l-4 border-accent/30">
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex flex-col">
                        <span className="font-accent text-[10px] text-white/30 tracking-[0.2em] uppercase mb-1">Expedition Date</span>
                        <span className="font-body text-sm text-white/60">{testimonial.date}</span>
                      </div>
                      <button className="flex items-center gap-3 text-accent font-accent text-sm font-bold tracking-[0.2em] uppercase hover:translate-x-2 transition-all cursor-pointer group">
                        FULL STORY 
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Overlay (Non-interactive z-10) */}
      <div className="absolute top-0 left-0 right-0 z-10 px-[6vw] py-[10vh] pointer-events-none">
        <div className="map-title-block max-w-[700px]">
          <span className="font-accent text-xs text-accent tracking-[0.3em] uppercase mb-6 block">
            The Global Network
          </span>
          <h2 className="font-heading text-[clamp(40px,6vw,90px)] font-bold text-white leading-[0.85] tracking-[-0.04em]">
            Voices from<br />
            <span className="text-white/40 italic">Around the World</span>
          </h2>
          <p className="mt-10 font-body text-lg lg:text-xl text-white/60 max-w-md leading-relaxed">
            Click map pins to unlock authentic stories from our global community of adventurers.
          </p>
        </div>
      </div>

      {/* Stats Footer (Non-interactive z-10) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-[6vw] py-[8vh] pointer-events-none">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {[
            { val: '07', label: 'Continents' },
            { val: '2,400+', label: 'Happy Trekkers' },
            { val: '4.9', label: 'Average Rating' },
            { val: '15', label: 'Years Active' }
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="text-center group">
                <div className="font-heading text-5xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{stat.val}</div>
                <div className="font-accent text-[10px] text-white/40 tracking-[0.3em] uppercase">{stat.label}</div>
              </div>
              {i < 3 && <div className="w-px h-16 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
        
        .section-pinned {
          height: 100vh;
          width: 100%;
          position: relative;
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;