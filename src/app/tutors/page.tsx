"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Users, MapPin, Calendar, ArrowRight, Menu, X } from 'lucide-react';

// Helper component for animated number counters
const CountUpNumber = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = parseInt(end, 10);
    if (start === endValue) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};


// Helper component for the countdown timer
const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

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

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            timerComponents.push(
                <div key="expired" className="text-center p-4 bg-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">The deadline has passed!</div>
                </div>
            );
            return; // exit loop
        }

        timerComponents.push(
            <div key={interval} className="text-center p-2">
                <div className="text-4xl md:text-5xl font-bold text-gray-800">{String(timeLeft[interval]).padStart(2, '0')}</div>
                <div className="text-sm uppercase text-gray-500">{interval}</div>
            </div>
        );
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
            {timerComponents}
        </div>
    );
};


// Main App Component for Tutor Page
export default function StuySummerTutoringTutorPage() {
    const applicationDeadline = "2025-07-05T03:59:00Z"; // July 4th @ 11:59 PM EDT is July 5th 03:59 UTC
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold text-blue-600">Stuyvesant Summer Tutoring</a>
                     <nav className="hidden md:flex items-center space-x-6">
                        <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">For Tutees</a>
                        <a
                            href="https://forms.gle/hK3xjXTvdE5UpsUW8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Apply Now
                        </a>
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
                 {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg">
                        <a href="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">For Tutees</a>
                        <a 
                           href="https://forms.gle/hK3xjXTvdE5UpsUW8"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block px-6 py-3 font-semibold text-blue-600 hover:bg-gray-100"
                        >
                           Apply Now
                        </a>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-center py-20 md:py-32 px-6 bg-white">
                     <div 
                        className="absolute top-0 left-0 w-full h-full bg-grid-blue-100/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
                     ></div>
                    <div className="container mx-auto relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Become a Tutor This Summer.
                        </h2>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            It’s officially the end of the school year, and summer’s well on its way! Congrats on surviving another year of Stuy. SST is excited to announce the opening of tutor applications for our Summer 2025 program!
                        </p>
                        <div className="mt-10">
                            <a
                                href="https://forms.gle/hK3xjXTvdE5UpsUW8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                Start Your Application
                            </a>
                            <p className="mt-4 text-sm text-gray-500">First come, first served!</p>
                        </div>
                    </div>
                </section>
                
                {/* Deadline Countdown Section */}
                <section className="bg-white pb-16 md:pb-24">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Application Deadline</h3>
                        <p className="text-gray-500 mb-6">July 4th, 2025 @ 11:59 PM EDT</p>
                        <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-xl shadow-inner">
                             <CountdownTimer targetDate={applicationDeadline} />
                        </div>
                    </div>
                </section>


                {/* Why Join Us Section */}
                <section className="py-20 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Why Tutor with SST?</h2>
                            <p className="mt-3 text-lg text-gray-600">Make an impact, earn hours, and join a great community.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Meaningful Tutoring</h3>
                                <p className="text-gray-600">Work with K-9 students from around NYC and help address educational inequality. Our commitment-flexible model fits your summer schedule.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                    <Award size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Earn Volunteer Hours</h3>
                                <p className="text-gray-600">Get official volunteer hours for Key Club, Red Cross, ARISTA, or any other organization. A great way to build your resume and give back.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Join a Community</h3>
                                <p className="text-gray-600">Become part of a tight-knit community of like-minded Stuyvesant students who are passionate about education and making a difference.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="py-20 md:py-24 bg-blue-600 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact Last Summer</h2>
                        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">We're proud of what our community achieves together. The numbers speak for themselves.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-blue-700/50 p-8 rounded-xl">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={60} />+</div>
                                <div className="text-blue-200 mt-2">Tutors</div>
                            </div>
                            <div className="bg-blue-700/50 p-8 rounded-xl">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={200} />+</div>
                                <div className="text-blue-200 mt-2">Unique Tutees</div>
                            </div>
                            <div className="bg-blue-700/50 p-8 rounded-xl">
                                <div className="text-5xl font-extrabold"><CountUpNumber end={1350} />+</div>
                                <div className="text-blue-200 mt-2">Volunteer Hours</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-gray-50">
                    <div className="container mx-auto px-6 py-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
                        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Spread the word to your friends and let them know about this amazing opportunity. Apply today!</p>
                        <div className="mt-8">
                             <a
                                href="https://forms.gle/hK3xjXTvdE5UpsUW8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center"
                            >
                                Apply to be a Tutor <ArrowRight className="ml-2" size={20} />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-semibold text-lg text-white">Stuyvesant Summer Tutoring</p>
                    <p className="mt-2">Your SST President and Vice President, David and Tiffany</p>
                    <p className="text-sm mt-4">&copy; {new Date().getFullYear()} Stuyvesant Summer Tutoring. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
