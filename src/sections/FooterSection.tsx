import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FooterSectionProps {
  className?: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    route: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Flowing section animation
      gsap.fromTo(
        content.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', route: '', message: '' });
  };

  const quickLinks = ['Routes', 'Dates', 'Gear', 'Safety', 'About'];

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative bg-alpine-light py-20 lg:py-32 ${className}`}
    >
      {/* Subtle mountain silhouette */}
      <div 
        className="absolute bottom-0 right-0 w-1/2 h-64 opacity-5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%)',
          maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'1\' d=\'M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
          maskSize: 'cover',
          maskPosition: 'bottom',
        }}
      />

      <div ref={contentRef} className="relative z-10 px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
              Let's build your trek.
            </h2>
            <p className="font-body text-lg text-white/70 mb-10 max-w-md">
              We reply within 24 hours. If you're already in Nepal, visit our Kathmandu office.
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-10">
              <a 
                href="mailto:hello@alpinetreknepal.com"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-body">hello@alpinetreknepal.com</span>
              </a>
              <a 
                href="tel:+977-1-XXXXXXX"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5 text-accent" />
                <span className="font-body">+977-1-XXXXXXX</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="font-body">Thamel, Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5 text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-5 h-5 text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5 text-white/60" />
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-accent text-xs tracking-wider text-white/50 uppercase mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-accent text-xs tracking-wider text-white/50 uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-accent text-xs tracking-wider text-white/50 uppercase mb-2">
                  Preferred Route
                </label>
                <select
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-alpine-dark">Select a route</option>
                  <option value="everest" className="bg-alpine-dark">Everest Base Camp</option>
                  <option value="annapurna" className="bg-alpine-dark">Annapurna Circuit</option>
                  <option value="mustang" className="bg-alpine-dark">Upper Mustang</option>
                  <option value="langtang" className="bg-alpine-dark">Langtang Valley</option>
                  <option value="custom" className="bg-alpine-dark">Custom Route</option>
                </select>
              </div>

              <div>
                <label className="block font-accent text-xs tracking-wider text-white/50 uppercase mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                  placeholder="Tell us about your ideal trek..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover"
              >
                <Send className="w-4 h-4" />
                Send inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {quickLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-accent text-sm text-white/50 hover:text-white transition-colors relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-right">
            <p className="font-accent text-xs text-white/40">
              Licensed by Nepal Tourism Board. Leave No Trace principles.
            </p>
            <p className="font-accent text-xs text-white/30 mt-1">
              © 2024 Alpine Trek Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
