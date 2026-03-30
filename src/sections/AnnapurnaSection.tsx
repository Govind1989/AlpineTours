import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight,  Clock, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

gsap.registerPlugin(ScrollTrigger);

interface AnnapurnaSectionProps {
  className?: string;
}

// Himalayan trails data with portrait images
const himalayanTrails = [
  {
    id: 1,
    name: 'Mustang Region',
    description: 'Ancient kingdom with dramatic desert landscapes and Tibetan culture.',
    duration: '10-14 Days',
    difficulty: 'Moderate',
    maxAltitude: '4,200m',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=800&fit=crop',
  },
  {
    id: 2,
    name: 'Dolpo Region',
    description: 'Remote wilderness with pristine Shey Phoksundo Lake.',
    duration: '12-18 Days',
    difficulty: 'Challenging',
    maxAltitude: '5,110m',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
  },
  {
    id: 3,
    name: 'Manaslu Tsum Region',
    description: 'Circumnavigate the eighth highest peak through hidden valleys.',
    duration: '14-21 Days',
    difficulty: 'Challenging',
    maxAltitude: '5,160m',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop',
  },
  {
    id: 4,
    name: 'Langtang Gosainkunda',
    description: 'Sacred lakes and rhododendron forests near Kathmandu.',
    duration: '7-12 Days',
    difficulty: 'Moderate',
    maxAltitude: '4,380m',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=800&fit=crop',
  },
  {
    id: 5,
    name: 'Everest Khumbu Region',
    description: 'The ultimate trek to the base of the world\'s highest peak.',
    duration: '12-16 Days',
    difficulty: 'Challenging',
    maxAltitude: '5,545m',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=800&fit=crop',
  },
  {
    id: 6,
    name: 'Annapurna Nar Phu',
    description: 'Hidden valleys and ancient villages off the beaten path.',
    duration: '10-14 Days',
    difficulty: 'Moderate',
    maxAltitude: '5,320m',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=800&fit=crop',
  },
];


const AnnapurnaSection: React.FC<AnnapurnaSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Initialize Embla carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Update scroll state
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

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
        src="/everest_hero.jpg"
        alt="everest"
        className="bg-image"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)'
        }}
      />

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

        {/* Premium Carousel Container */}
        <div
          ref={carouselContainerRef}
          className="w-full flex flex-col items-center"
        >
          {/* Section Title */}
          <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-white mb-8 text-center">
            Top Destinations
          </h3>

          {/* Carousel Wrapper */}
          <div className="relative w-full max-w-[1400px] mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${!canScrollPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${!canScrollNext ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Embla Carousel */}
            <div className="overflow-hidden px-16" ref={emblaRef}>
              <div className="flex gap-6">
                {himalayanTrails.map((trail, index) => (
                  <div
                    key={trail.id}
                    className="flex-[0_0_280px] min-w-0"
                  >
                    <div
                      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${selectedIndex === index
                          ? 'scale-100 opacity-100'
                          : 'scale-95 opacity-70'
                        }`}
                    >
                      {/* Card Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={trail.image}
                          alt={trail.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                          {/* Trail Name */}
                          <h4 className="font-heading text-xl font-semibold text-white mb-2">
                            {trail.name}
                          </h4>

                          {/* Description */}
                          <p className="font-body text-sm text-white/70 mb-4 line-clamp-2">
                            {trail.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-white/60 text-xs mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {trail.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mountain className="w-3.5 h-3.5" />
                              {trail.maxAltitude}
                            </span>
                          </div>

                          {/* CTA Button */}
                          <Button
                            variant="ghost"
                            className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-accent tracking-wider rounded-lg backdrop-blur-sm transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                          >
                            Explore Route
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {himalayanTrails.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === index
                      ? 'w-8 bg-white'
                      : 'bg-white/40 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnapurnaSection;
