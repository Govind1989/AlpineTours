import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Routes', href: '#routes' },
  { label: 'Dates', href: '#dates' },
  { label: 'Bike Tours', href: '#bike-tours' },
  { label: 'Cultural', href: '#cultural' },
  { label: 'About', href: '#about' },
];

const Navigation: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [isVisible]);

  const scrollToSection = (href: string) => {
    const sectionMap: Record<string, number> = {
      '#routes': 1,
      '#dates': 5,
      '#bike-tours': 2,
      '#cultural': 3,
      '#about': 8,
    };
    
    const sectionIndex = sectionMap[href] || 0;
    const sections = document.querySelectorAll('.section-pinned');
    if (sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000] px-6 lg:px-[6vw] py-4 lg:py-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(11, 15, 23, 0.9) 0%, rgba(11, 15, 23, 0.5) 60%, transparent 100%)',
          backdropFilter: 'blur(12px)',
          transform: 'translateY(-100%)',
          opacity: 0,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-heading text-xl lg:text-2xl font-bold text-white tracking-tight">
            Alpine Trek <span className="text-accent">Nepal</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="font-accent text-sm tracking-wider text-white/70 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button className="hidden lg:block px-5 py-2.5 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover">
            Contact
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[999] bg-alpine-dark/95 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="font-heading text-2xl text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button className="mt-4 px-8 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg">
              Contact
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
