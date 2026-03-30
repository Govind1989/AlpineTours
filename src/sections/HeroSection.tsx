import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Calendar, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

// Trek routes data
const trekRoutes = [
  { value: 'everest-base-camp', label: 'Everest Base Camp Trek' },
  { value: 'annapurna-base-camp', label: 'Annapurna Base Camp Trek' },
  { value: 'annapurna-circuit', label: 'Annapurna Circuit Trek' },
  { value: 'manaslu-circuit', label: 'Manaslu Circuit Trek' },
  { value: 'langtang-valley', label: 'Langtang Valley Trek' },
  { value: 'mustang-upper', label: 'Upper Mustang Trek' },
  { value: 'dolpo-shey', label: 'Shey Phoksundo Trek' },
  { value: 'gokyo-lakes', label: 'Gokyo Lakes Trek' },
];

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [selectedRoute, setSelectedRoute] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('2');

  // YouTube video ID from the URL
  const videoId = 'BYZrgnQkBdk';

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

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

  // Scroll-driven exit animation with video pause/resume
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
            gsap.set(videoContainerRef.current, { scale: 1, y: 0 });
            // Resume video when scrolling back to top
            postMessageToPlayer('playVideo');
          },
          onLeave: () => {
            // Pause video when leaving the section
            postMessageToPlayer('pauseVideo');
          },
          onEnter: () => {
            // Play video when entering the section
            postMessageToPlayer('playVideo');
          },
          onEnterBack: () => {
            // Resume video when scrolling back into view
            postMessageToPlayer('playVideo');
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
        videoContainerRef.current,
        { scale: 1, y: 0 },
        { scale: 1.06, y: '-4vh', ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Helper function to post messages to YouTube iframe
  const postMessageToPlayer = (command: string) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  };

  // Handle search
  const handleSearch = () => {
    console.log('Search:', { selectedRoute, startDate, endDate, travelers });
    // Implement search logic here
  };

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* YouTube Video Background */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&enablejsapi=1&version=3&playerapiid=ytplayer`}
            title="YouTube video background"
            className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ pointerEvents: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />

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

        {/* Checkout Form Card */}
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className="glass-card rounded-2xl p-6 lg:p-8 max-w-[520px] w-[38vw] min-w-[340px] backdrop-blur-xl bg-white/10 border border-white/20"
          >
            <h3 className="font-heading text-xl lg:text-2xl font-semibold text-white mb-2 uppercase tracking-wide">
              Plan Your Trek
            </h3>
            <p className="font-body text-sm text-white/70 mb-6">
              Routes for every season. Local guides. Small groups.
            </p>

            {/* Checkout Form */}
            <div className="space-y-4">
              {/* Route Selection */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Select Route
                </Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30 h-11">
                    <SelectValue placeholder="Choose your trek route" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                    {trekRoutes.map((route) => (
                      <SelectItem 
                        key={route.value} 
                        value={route.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                      >
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30 h-11 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30 h-11 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Travelers Selection */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Travelers
                </Label>
                <Select value={travelers} onValueChange={setTravelers}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-white/30 h-11">
                    <SelectValue placeholder="Number of travelers" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                    {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((num) => (
                      <SelectItem 
                        key={num} 
                        value={String(num)}
                        className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                      >
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-accent text-sm tracking-wider rounded-lg transition-all duration-300 group flex items-center justify-center gap-2 mt-2"
              >
                <Search className="w-4 h-4" />
                Search Treks
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
