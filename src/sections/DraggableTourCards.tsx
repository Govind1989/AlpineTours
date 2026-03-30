import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { InertiaPlugin } from 'gsap/dist/InertiaPlugin';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
    ArrowRight,
    MapPin,
    Calendar,
    Users,
    Clock,
    Mountain,
    Compass,
    Star
} from 'lucide-react';

// Register GSAP Plugins
gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

interface Tour {
    id: string;
    title: string;
    location: string;
    date: string;
    duration: string;
    groupSize: string;
    price: string;
    image: string;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    rating: number;
    spotsLeft: number;
}

interface DraggableTourCardsProps {
    className?: string;
}

const upcomingTours: Tour[] = [
    {
        id: '1',
        title: 'Annapurna Circuit',
        location: 'Nepal',
        date: 'Apr 15 - Apr 28, 2026',
        duration: '13 Days',
        groupSize: '8-12',
        price: '$2,450',
        image: '/annapurna_ridge.jpg',
        difficulty: 'Challenging',
        rating: 4.9,
        spotsLeft: 3
    },
    {
        id: '2',
        title: 'Everest Base Camp',
        location: 'Nepal',
        date: 'May 02 - May 12, 2026',
        duration: '10 Days',
        groupSize: '6-10',
        price: '$3,200',
        image: '/everest_hero.jpg',
        difficulty: 'Moderate',
        rating: 4.8,
        spotsLeft: 5
    },
    {
        id: '3',
        title: 'Mustang Bike Trails',
        location: 'Nepal',
        date: 'Jun 10 - Jun 18, 2026',
        duration: '8 Days',
        groupSize: '8-12',
        price: '$2,800',
        image: '/mustang_valley.jpg',
        difficulty: 'Moderate',
        rating: 4.9,
        spotsLeft: 7
    },
    // {
    //     id: '4',
    //     title: 'Laugavegur Trail',
    //     location: 'Iceland',
    //     date: 'Jul 05 - Jul 10, 2026',
    //     duration: '5 Days',
    //     groupSize: '6-8',
    //     price: '$1,950',
    //     image: '/tours/iceland.jpg',
    //     difficulty: 'Easy',
    //     rating: 4.7,
    //     spotsLeft: 2
    // },
    // {
    //     id: '5',
    //     title: 'Kilimanjaro Summit',
    //     location: 'Tanzania',
    //     date: 'Aug 12 - Aug 20, 2026',
    //     duration: '8 Days',
    //     groupSize: '10-14',
    //     price: '$3,650',
    //     image: '/tours/kilimanjaro.jpg',
    //     difficulty: 'Challenging',
    //     rating: 4.9,
    //     spotsLeft: 4
    // }
];

const DraggableTourCards: React.FC<DraggableTourCardsProps> = ({ className = '' }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorLabelRef = useRef<HTMLDivElement>(null);
    const [activeCard, setActiveCard] = useState<string | null>(null);

    let cardZIndex = 50;

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const container = containerRef.current;
        if (!section || !container) return;

        const ctx = gsap.context(() => {
            // Cursor setup - quickTo for performance
            const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
            const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

            const handleMouseMove = (e: MouseEvent) => {
                xTo(e.clientX);
                yTo(e.clientY);
            };

            window.addEventListener("mousemove", handleMouseMove);

            // ScrollTrigger timeline for section entrance
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=130%',
                    pin: true,
                    scrub: 0.6,
                },
            });

            // ENTRANCE: Cards fly in from bottom scattered
            cardsRef.current.forEach((card, index) => {
                const randomRotation = gsap.utils.random(-15, 15);
                const randomX = gsap.utils.random(-100, 100);

                scrollTl.fromTo(card,
                    {
                        y: '120vh',
                        x: randomX,
                        rotation: randomRotation,
                        opacity: 0,
                        scale: 0.8
                    },
                    {
                        y: 0,
                        x: 0,
                        rotation: index * 3 - 6, // Slight fan arrangement
                        opacity: 1,
                        scale: 1,
                        ease: 'none',
                        duration: 0.3
                    },
                    index * 0.05
                );
            });

            // SETTLE hold

            // EXIT: Cards scatter on scroll out
            scrollTl.to(cardsRef.current, {
                y: () => gsap.utils.random(-50, 50),
                x: () => gsap.utils.random(-200, 200),
                rotation: () => gsap.utils.random(-30, 30),
                opacity: 0,
                scale: 0.9,
                stagger: 0.02,
                ease: 'power2.in'
            }, 0.7);

            // Draggable setup for each card
            cardsRef.current.forEach((card) => {
                Draggable.create(card, {
                    type: "x,y",
                    bounds: container,
                    inertia: true,
                    edgeResistance: 0.65,
                    onPress: function () {
                        // Bring to front
                        this.target.style.zIndex = ++cardZIndex;
                        setActiveCard(this.target.dataset.tourId || null);

                        // Scale up with glass shimmer
                        gsap.to(this.target, {
                            scale: 1.05,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            duration: 0.3,
                            ease: "power2.out"
                        });

                        // Cursor becomes "DRAG"
                        gsap.to(cursorDotRef.current, { scale: 0, duration: 0.2 });
                        gsap.to(cursorLabelRef.current, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: "back.out(2)"
                        });
                    },
                    onRelease: function () {
                        setActiveCard(null);

                        // Return to stack with physics
                        gsap.to(this.target, {
                            scale: 1,
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                            duration: 0.3,
                            ease: "power2.out"
                        });

                        // Revert cursor
                        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.2 });
                        gsap.to(cursorLabelRef.current, {
                            opacity: 0,
                            scale: 0,
                            duration: 0.2
                        });
                    },
                    onDragEnd: function () {
                        // Check if card was thrown far enough to dismiss (optional feature)
                        const bounds = this.target.getBoundingClientRect();
                        const containerBounds = container.getBoundingClientRect();

                        // If dragged to edge, animate out
                        if (
                            bounds.left < containerBounds.left - 100 ||
                            bounds.right > containerBounds.right + 100 ||
                            bounds.top < containerBounds.top - 100 ||
                            bounds.bottom > containerBounds.bottom + 100
                        ) {
                            gsap.to(this.target, {
                                opacity: 0,
                                scale: 0.8,
                                duration: 0.3,
                                onComplete: () => {
                                    gsap.set(this.target, { x: 0, y: 0, opacity: 1, scale: 1 });
                                }
                            });
                        }
                    }
                });
            });

            // Hover effects for cursor
            cardsRef.current.forEach((card) => {
                card.addEventListener('mouseenter', () => {
                    if (!Draggable.get(card)?.isPressed) {
                        gsap.to(cursorDotRef.current, { scale: 0, duration: 0.2 });
                        gsap.to(cursorLabelRef.current, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: "back.out(2)"
                        });
                    }
                });

                card.addEventListener('mouseleave', () => {
                    const draggable = Draggable.get(card);
                    if (!draggable?.isPressed) {
                        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.2 });
                        gsap.to(cursorLabelRef.current, {
                            opacity: 0,
                            scale: 0,
                            duration: 0.2
                        });
                    }
                });
            });

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }, section);

        return () => ctx.revert();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'Moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'Challenging': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            default: return 'bg-white/20 text-white border-white/30';
        }
    };

    return (
        <section
            ref={sectionRef}
            id="upcoming-tours"
            className={`section-pinned relative overflow-hidden ${className}`}
        >
            {/* Background with gradient matching GroupSection */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

            {/* Vignette overlay matching GroupSection */}
            <div className="vignette-overlay" />

            {/* Custom Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
                style={{ transform: 'translate(-50%, -50%)' }}
            >
                <div
                    ref={cursorDotRef}
                    className="w-4 h-4 rounded-full bg-white transition-transform"
                />
                <div
                    ref={cursorLabelRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0"
                >
                    <span className="text-xs font-accent tracking-widest text-white uppercase whitespace-nowrap">
                        Drag
                    </span>
                </div>
            </div>

            {/* Header Content */}
            <div className="relative z-10 h-full flex flex-col px-[6vw] py-[10vh]">
                {/* Headline Block - Matching GroupSection typography */}
                <div className="max-w-[46vw] mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
                            <Compass className="w-6 h-6 text-accent" />
                        </div>
                        <span className="font-accent text-sm tracking-[0.2em] text-accent uppercase">
                            Upcoming Departures
                        </span>
                    </div>

                    <h2 className="font-heading text-[clamp(32px,4.5vw,64px)] font-bold text-white leading-[0.95] tracking-[-0.02em]">
                        Grab & Explore.<br />
                        <span className="text-white/60">Your next adventure awaits.</span>
                    </h2>

                    <p className="mt-6 font-body text-lg lg:text-xl text-white/70 max-w-md">
                        Drag the cards to browse our scheduled group treks. Fixed departures with expert guides.
                    </p>
                </div>

                {/* Draggable Cards Container */}
                <div
                    ref={containerRef}
                    className="flex-1 relative w-full max-w-5xl mx-auto perspective-1000"
                >
                    {upcomingTours.map((tour, index) => (
                        <div
                            key={tour.id}
                            ref={(el) => { if (el) cardsRef.current[index] = el; }}
                            data-tour-id={tour.id}
                            className="draggable-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] cursor-grab active:cursor-grabbing"
                            style={{
                                zIndex: 50 - index,
                                transform: `translate(-50%, -50%) rotate(${index * 3 - 6}deg) translateY(${index * 5}px)`
                            }}
                        >
                            {/* Glass Card matching GroupSection glass-card */}
                            <div className={`
                glass-card rounded-2xl overflow-hidden
                border border-white/20 backdrop-blur-xl
                bg-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                transition-shadow duration-300
                ${activeCard === tour.id ? 'ring-2 ring-accent/50' : ''}
              `}>
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Difficulty Badge */}
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-accent tracking-wider uppercase border backdrop-blur-sm ${getDifficultyColor(tour.difficulty)}`}>
                                        {tour.difficulty}
                                    </div>

                                    {/* Spots Left Badge */}
                                    {tour.spotsLeft <= 3 && (
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-500/90 text-white text-xs font-accent tracking-wider animate-pulse">
                                            {tour.spotsLeft} spots left
                                        </div>
                                    )}

                                    {/* Price Tag */}
                                    <div className="absolute bottom-4 right-4">
                                        <span className="font-heading text-2xl font-bold text-white drop-shadow-lg">
                                            {tour.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Title & Location */}
                                    <div>
                                        <h3 className="font-heading text-2xl font-bold text-white mb-1">
                                            {tour.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/60">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            <span className="font-body text-sm">{tour.location}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(tour.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-white/60 font-body">{tour.rating}</span>
                                    </div>

                                    {/* Tour Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 font-accent uppercase tracking-wider">Date</p>
                                                <p className="text-sm text-white font-body">{tour.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 font-accent uppercase tracking-wider">Duration</p>
                                                <p className="text-sm text-white font-body">{tour.duration}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 font-accent uppercase tracking-wider">Group</p>
                                                <p className="text-sm text-white font-body">{tour.groupSize} people</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Mountain className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 font-accent uppercase tracking-wider">Type</p>
                                                <p className="text-sm text-white font-body">Guided Trek</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA Button matching GroupSection style */}
                                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-accent text-sm tracking-wider rounded-lg btn-hover group transition-all duration-300 hover:bg-accent/90">
                                        View Itinerary
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative shadow beneath card */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/40 blur-xl rounded-full -z-10" />
                        </div>
                    ))}

                    {/* Instructions */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 flex items-center gap-2 text-white/40 font-accent text-sm tracking-wider uppercase">
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                        Drag cards to explore
                    </div>
                </div>
            </div>

        </section>
    );
};

export default DraggableTourCards;