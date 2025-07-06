// src/app/tutors/page.tsx

"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Award, Users, ArrowRight, Menu, X } from 'lucide-react';
import { useOnScreen } from '../hooks/useOnScreen'; // <--- IMPORT THE HOOK

// --- Type Definitions ---
interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

// THE LOCAL useOnScreen HOOK HAS BEEN DELETED FROM HERE

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', direction = 'up' }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2, rootMargin: '0px' });

    const getDirectionClasses = () => {
        switch (direction) {
            case 'left': return 'translate-x-[-40px]';
            case 'right': return 'translate-x-[40px]';
            case 'down': return 'translate-y-[-40px]';
            case 'up': default: return 'translate-y-[40px]';
        }
    };

    const baseClasses = 'transition-all duration-1000 ease-out';
    const hiddenClasses = `opacity-0 ${getDirectionClasses()}`;
    const visibleClasses = 'opacity-100 translate-x-0 translate-y-0';

    return (
        <div ref={ref} className={`${baseClasses} ${className} ${isVisible ? visibleClasses : hiddenClasses}`}>
            {children}
        </div>
    );
};


const CountUpNumber = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen<HTMLSpanElement>({ threshold: 0.5 });

  useEffect(() => {
    if (isVisible) {
        const start = 0;
        const endValue = end;
        if (start === endValue) return;

        let startTime: number | null = null;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * endValue));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
    }
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}</span>;
};


const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });
    
    if (!Object.keys(timeLeft).length) {
        return (
             <div className="text-center p-4 bg-red-100 rounded-lg">
                <div className="text-2xl font-bold text-red-600">The deadline has passed!</div>
                <p className="text-red-500">Applications for Summer 2025 are now closed.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center space-x-2 md:space-x-4">
            {Object.keys(timeLeft).map((interval) => (
                <div key={interval} className="text-center p-2">
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">{String(timeLeft[interval]).padStart(2, '0')}</div>
                    <div className="text-sm uppercase text-gray-500">{interval}</div>
                </div>
            ))}
        </div>
    );
};


// Main App Component for Tutor Page
export default function StuySummerTutoringTutorPage() {
    const applicationDeadline = "2025-07-05T03:59:00Z"; // July 4th @ 11:59 PM EDT is July 5th 03:59 UTC
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800 overflow-x-hidden">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
                 <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src="/images/logo.png" alt="SST Logo" width={56} height={56} className="h-14 w-auto" />
                        <span className="text-xl md:text-2xl font-bold text-blue-600">Stuyvesant Summer Tutoring</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">For Tutees</Link>
                        <a href="https://forms.gle/hK3xjXTvdE5UpsUW8" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                            Apply Now
                        </a>
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg">
                        <Link href="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">For Tutees</Link>
                        <a href="https://forms.gle/hK3xjXTvdE5UpsUW8" target="_blank" rel="noopener noreferrer" className="block px-6 py-3 font-semibold text-blue-600 hover:bg-gray-100">Apply Now</a>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-center py-20 md:py-32 px-6 bg-white">
                     <div className="absolute top-0 left-0 w-full h-full bg-grid-blue-100/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                    <div className="container mx-auto relative z-10">
                        <AnimatedSection direction="down">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                Become a Tutor This Summer.
                            </h2>
                        </AnimatedSection>
                        <AnimatedSection direction="up" className="transition-delay-200">
                            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                                It’s officially the end of the school year, and summer’s well on its way! SST is excited to announce the opening of tutor applications for our Summer 2025 program!
                            </p>
                        </AnimatedSection>
                        <AnimatedSection className="mt-10 transition-delay-400">
                            <a href="https://forms.gle/hK3xjXTvdE5UpsUW8" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Start Your Application
                            </a>
                            <p className="mt-4 text-sm text-gray-500">First come, first served!</p>
                        </AnimatedSection>
                    </div>
                </section>
                
                {/* Deadline Countdown Section */}
                <section className="bg-white pb-16 md:pb-24">
                    <AnimatedSection className="container mx-auto px-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Application Deadline</h3>
                        <p className="text-gray-500 mb-6">July 4th, 2025 @ 11:59 PM EDT</p>
                        <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-xl shadow-inner">
                             <CountdownTimer targetDate={applicationDeadline} />
                        </div>
                    </AnimatedSection>
                </section>

                {/* Why Join Us Section */}
                <section className="py-20 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <AnimatedSection className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Why Tutor with SST?</h2>
                            <p className="mt-3 text-lg text-gray-600">Make an impact, earn hours, and join a great community.</p>
                        </AnimatedSection>
                        <div className="grid md:grid-cols-3 gap-8">
                            <AnimatedSection direction="left" className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6"><BookOpen size={32} /></div>
                                <h3 className="text-xl font-semibold mb-3">Meaningful Tutoring</h3>
                                <p className="text-gray-600">Work with K-9 students from around NYC and help address educational inequality.</p>
                            </AnimatedSection>
                            <AnimatedSection direction="up" className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transition-delay-200">
                                <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mb-6"><Award size={32} /></div>
                                <h3 className="text-xl font-semibold mb-3">Earn Volunteer Hours</h3>
                                <p className="text-gray-600">Get official hours for Key Club, Red Cross, ARISTA, or any other organization.</p>
                            </AnimatedSection>
                            <AnimatedSection direction="right" className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transition-delay-400">
                                <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mb-6"><Users size={32} /></div>
                                <h3 className="text-xl font-semibold mb-3">Join a Community</h3>
                                <p className="text-gray-600">Become part of a tight-knit community of like-minded Stuyvesant students.</p>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="py-20 md:py-24 bg-blue-600 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact Last Summer</h2>
                            <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">We&apos;re proud of what our community achieves together. The numbers speak for themselves.</p>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <AnimatedSection direction="up" className="bg-blue-700/50 p-8 rounded-xl">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={60} />+</div>
                                <div className="text-blue-200 mt-2">Tutors</div>
                            </AnimatedSection>
                            <AnimatedSection direction="up" className="bg-blue-700/50 p-8 rounded-xl transition-delay-200">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={200} />+</div>
                                <div className="text-blue-200 mt-2">Unique Tutees</div>
                            </AnimatedSection>
                            <AnimatedSection direction="up" className="bg-blue-700/50 p-8 rounded-xl transition-delay-400">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={1350} />+</div>
                                <div className="text-blue-200 mt-2">Volunteer Hours</div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-gray-50">
                    <div className="container mx-auto px-6 py-20 text-center">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Spread the word to your friends and let them know about this amazing opportunity. Apply today!</p>
                            <div className="mt-8">
                                <a href="https://forms.gle/hK3xjXTvdE5UpsUW8" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center">
                                    Apply to be a Tutor <ArrowRight className="ml-2" size={20} />
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10 relative z-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-semibold text-lg text-white">Stuyvesant Summer Tutoring</p>
                    <p className="mt-2">Your SST President and Vice President, David and Tiffany</p>
                    <p className="text-sm mt-6">© {new Date().getFullYear()} Stuyvesant Summer Tutoring | David Lee, SST President &apos;25</p>
                </div>
            </footer>
        </div>
    );
}