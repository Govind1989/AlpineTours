import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Compass,
    Shield,
    Route,
    Leaf,
    Users,
    MapPin,
    ArrowUpRight,
    
    Snowflake,
    ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WinterSectionProps {
    className?: string;
}

interface ValueProp {
    id: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
}

const valueProps: ValueProp[] = [
    {
        id: 'experts',
        icon: <Compass className="w-6 h-6" />,
        title: 'Expert Guides',
        subtitle: 'Masters of the Terrain',
        description: 'Every journey is led by certified professionals passionate about outdoor exploration. Our guides have decades of combined experience.'
    },
    {
        id: 'locations',
        icon: <MapPin className="w-6 h-6" />,
        title: 'Handpicked Locations',
        subtitle: 'Breathtaking Destinations',
        description: 'We take you to the most stunning, untouched, and soul-stirring destinations. Each route is personally vetted by our leaders.'
    },
    {
        id: 'customized',
        icon: <Route className="w-6 h-6" />,
        title: 'Tailored Adventures',
        subtitle: 'Your Pace, Your Style',
        description: 'We tailor every adventure to match your style, pace, and comfort. From gentle walks to challenging summits.'
    },
    {
        id: 'safety',
        icon: <Shield className="w-6 h-6" />,
        title: 'Safety First',
        subtitle: 'Uncompromising Standards',
        description: 'Your safety is our priority with quality gear, thorough briefings, and expert guides trained in wilderness first response.'
    },
    {
        id: 'seamless',
        icon: <Users className="w-6 h-6" />,
        title: 'Seamless Experience',
        subtitle: 'Stress-Free Travel',
        description: 'From first inquiry to final goodbye, we ensure your journey is smooth and stress-free. Every detail is handled with precision.'
    },
    {
        id: 'eco',
        icon: <Leaf className="w-6 h-6" />,
        title: 'Eco-Conscious',
        subtitle: 'Sustainable Adventures',
        description: 'We believe in responsible tourism that leaves a positive impact on nature and local communities. Leave no trace.'
    }
];

const WinterSection: React.FC<WinterSectionProps> = ({ className = '' }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const subheadRef = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const decorRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=200%',
                    pin: true,
                    scrub: 0.8,
                },
            });

            // PARALLAX BACKGROUND (0% - 100%)
            scrollTl.fromTo(
                bgRef.current,
                { scale: 1.15, y: '5vh' },
                { scale: 1, y: '-5vh', ease: 'none' },
                0
            );

            // ENTRANCE (0% - 35%)
            scrollTl.fromTo(
                headlineRef.current,
                { y: 100, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out' },
                0
            );

            scrollTl.fromTo(
                subheadRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, ease: 'power3.out' },
                0.1
            );

            // AESTHETIC CARD ENTRANCE: Floating from depth
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                scrollTl.fromTo(
                    card,
                    {
                        opacity: 0,
                        y: 80,
                        z: -100,
                        rotateX: -15,
                        scale: 0.9,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        z: 0,
                        rotateX: 0,
                        scale: 1,
                        ease: 'power2.out',
                    },
                    0.15 + (i * 0.06)
                );
            });

            // Snowflake decor animation
            scrollTl.fromTo(
                decorRef.current,
                { rotation: 0, scale: 0.5, opacity: 0 },
                { rotation: 360, scale: 1, opacity: 0.3, ease: 'none' },
                0
            );

            // EXIT (75% - 100%)
            scrollTl.to(
                [headlineRef.current, subheadRef.current],
                { y: -100, opacity: 0, ease: 'power2.in' },
                0.8
            );

            scrollTl.to(
                cardsRef.current,
                {
                    y: -150,
                    opacity: 0,
                    stagger: 0.02,
                    ease: 'power2.in'
                },
                0.8
            );

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="why-choose"
            className={`section-pinned relative overflow-hidden bg-slate-950 ${className}`}
        >
            {/* Background Image with Parallax */}
            <img
                ref={bgRef}
                src="/winter_trek.jpg"
                alt="Winter Wilderness"
                className="bg-image brightness-50"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
            <div className="vignette-overlay z-[2]" />

            {/* Floating Decoration */}
            <div ref={decorRef} className="absolute top-20 right-20 z-20 opacity-0 pointer-events-none">
                <Snowflake className="w-24 h-24 text-white blur-[1px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-[6vw] py-[8vh]">
                
                {/* Header Block (Hero-Consistent) */}
                <div className="text-center mb-16 max-w-4xl">
                    <div ref={headlineRef} className="inline-flex items-center gap-3 mb-6 opacity-0">
                        <div className="h-[1px] w-12 bg-accent" />
                        <span className="font-accent text-xs text-accent tracking-[0.4em] uppercase">The Alpine Difference</span>
                        <div className="h-[1px] w-12 bg-accent" />
                    </div>

                    <h2 
                        ref={headlineRef} 
                        className="font-heading text-[clamp(36px,5vw,80px)] font-bold text-white leading-[0.9] tracking-[-0.03em] mb-8 opacity-0"
                    >
                        Why Choose <br />
                        <span className="text-accent italic">Our Expeditions</span>
                    </h2>

                    <p 
                        ref={subheadRef}
                        className="font-body text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed opacity-0"
                    >
                        Where every journey becomes a lifetime memory. Trust us to turn your outdoor dreams into unforgettable Himalayan experiences.
                    </p>
                </div>

                {/* Aesthetic Value Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full perspective-[2000px]">
                    {valueProps.map((prop, index) => (
                        <div
                            key={prop.id}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="group relative opacity-0"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="glass-card-enhanced rounded-[2rem] p-8 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-3 border border-white/5 hover:border-accent/30 bg-slate-900/40 backdrop-blur-3xl overflow-hidden group">
                                {/* Ambient Glow Background */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 blur-3xl rounded-full transition-all duration-500 group-hover:bg-accent/20" />
                                
                                {/* Icon Header */}
                                <div className="relative mb-6 flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-accent group-hover:border-accent group-hover:scale-110 group-hover:rotate-3 shadow-xl">
                                        {prop.icon}
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                </div>

                                {/* Content (Hero-Consistent Typography) */}
                                <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-2 uppercase tracking-wide group-hover:text-accent transition-colors">
                                    {prop.title}
                                </h3>
                                <p className="font-accent text-[10px] text-accent/60 tracking-[0.2em] uppercase mb-4">
                                    {prop.subtitle}
                                </p>
                                <p className="font-body text-base text-white/60 leading-relaxed group-hover:text-white/90 transition-colors">
                                    {prop.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Footer */}
                <div className="mt-16 flex flex-col items-center gap-6 opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                    <button className="flex items-center gap-4 px-10 py-5 bg-accent text-white font-accent text-sm font-bold tracking-[0.3em] uppercase rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,77,46,0.5)] active:scale-95 group">
                        Start Your Journey
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </button>
                    <span className="text-white/30 font-accent text-[10px] tracking-[0.5em] uppercase">Verified Readiness</span>
                </div>
            </div>

            <style>{`
                .glass-card-enhanced {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
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

export default WinterSection;