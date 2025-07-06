"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';

// --- Helper Hooks and Components for Animations ---

const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

const AnimatedSection = ({ children, className = '', direction = 'up' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2, triggerOnce: true });

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

const CountUpNumber = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.5, triggerOnce: true });

  useEffect(() => {
    if (isVisible) {
        const start = 0;
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
    }
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}</span>;
};


// --- Reusable Section Components ---

const ParallaxSection = ({ imageUrl, children, className = '' }) => (
    <section
        className={`relative min-h-[80vh] md:min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center ${className}`}
        style={{ backgroundImage: `url('${imageUrl}')` }}
    >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white container mx-auto px-6 text-center">
            {children}
        </div>
    </section>
);

const ContentSection = ({ children, className = '' }) => (
    <section className={`relative bg-white z-20 py-20 md:py-24 overflow-x-hidden ${className}`}>
        <div className="container mx-auto px-6">
            {children}
        </div>
    </section>
);


// --- FAQ Data and Components ---
const faqData = [
    { question: "Is Stuyvesant Summer Tutoring free?", answer: "Yes! We are completely cost-free, so don’t worry about paying anything for our services!" },
    { question: "When will I know if my child is accepted?", answer: "You will receive an email at least a week before the program to confirm your child’s or children’s acceptance. You will also receive a tutee roster where you can find the day they are scheduled for." },
    { question: "What will my child do during tutoring sessions?", answer: "During tutoring sessions, we will print out and assign past State Tests (standardized tests) or SHSATs (if requested) to kids according to their grade level. Upon finishing the classwork, we will go over the test questions with the child and clear up any confusions they might have." },
    { question: "What if my child needs to prepare for other subjects or use different materials?", answer: "If you are not expecting your child to prepare for the State Tests, we will do our best to accommodate. For students in second grade and below, we will provide non-State Test Math and English resources. If you would like us to go over specific material with your child, please make sure to email us the material beforehand. For students in third grade and higher, we prefer not to use outside materials to ensure they are on track with the rest of the class, as we have plenty of practice tests and problems." },
    { question: "Is attendance mandatory?", answer: "While attendance is not mandatory, we highly suggest attending each session. Our Branch Directors will take attendance. If your child is going to be absent/late, please contact your respective branch director. For other issues, feel free to contact the presidents." },
    { question: "Will my child receive homework?", answer: "Nope! All assignments and work will be completed during the tutoring sessions. Tutors may assign optional Khan Academy practice at their discretion." },
    { question: "Where do your tutors come from?", answer: "All of our tutors come directly from Stuyvesant High School, a top NYC school. Our tutors are very well-versed in a variety of subjects and have excelled in the NY State test and Regents exams." },
    { question: "Can we participate if we don't live in the Queens area?", answer: "Yes! Our program aims to help all kids in NYC, so we have Branch Directors and tutors stationed in all the boroughs!" },
    { question: "How many tutors are there per session? Will my child get individualized attention?", answer: "There will be 5-15 tutors per session. After pairing, your child will typically have a one-on-one or one-on-two session with their tutor for the rest of the summer." },
    { question: "How are tutors monitored or overseen?", answer: "Each in-person session is monitored by a Branch Director, who records volunteer hours and ensures tutors are on task. If a tutor is absent, the Branch Director will step in to tutor your child." },
    { question: "When will the program start and end?", answer: "It will start on July 8th and will end on August 31st." }
];

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-gray-200 py-4">
        <button className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none" onClick={onClick}>
            <span className="hover:text-blue-600 transition-colors">{faq.question}</span>
            <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} size={24} />
        </button>
        <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
                <p className="text-gray-600 pr-4 pb-2">{faq.answer}</p>
            </div>
        </div>
    </div>
);

// --- Main Page Component ---
export default function StuySummerTutoringTuteePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const handleFaqClick = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };
    
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src="/images/logo.png" alt="SST Logo" width={56} height={56} className="h-14 w-auto" />
                        <span className="text-xl md:text-2xl font-bold text-blue-600">Stuyvesant Summer Tutoring</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/tutors" className="text-gray-600 hover:text-blue-600 transition-colors">For Tutors</Link>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSe6W0ZYjSN0mUidZax7HInvQvBnC8fGSDLPVkim4oPnaZTHPw/viewform" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                            Sign Up Now
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
                        <Link href="/tutors" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">For Tutors</Link>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSe6W0ZYjSN0mUidZax7HInvQvBnC8fGSDLPVkim4oPnaZTHPw/viewform" target="_blank" rel="noopener noreferrer" className="block px-6 py-3 font-semibold text-blue-600 hover:bg-gray-100">Sign Up Now</a>
                    </div>
                )}
            </header>

            <main>
                {/* Parallax Hero Section */}
                <ParallaxSection imageUrl="/images/library.jpg">
                    <AnimatedSection direction="down">
                        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight shadow-text">
                            Free Summer Tutoring for K-9 Students
                        </h2>
                        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto shadow-text-sm">
                           SST is a student-run organization offering FREE in-person tutoring for English, Math, and Science to K-9 students.
                        </p>
                        <div className="mt-10">
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSe6W0ZYjSN0mUidZax7HInvQvBnC8fGSDLPVkim4oPnaZTHPw/viewform" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Sign Up for Free Tutoring
                            </a>
                        </div>
                    </AnimatedSection>
                </ParallaxSection>

                {/* Content Section 1: Program Info */}
                <ContentSection>
                    <AnimatedSection direction="up">
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-6">Program Details</h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-4">
                                This year, our program will run from <span className="font-semibold text-blue-600">July 7th to August 31st, 2025</span>. We host two-hour long, in-person tutoring sessions at public library branches in Queens, Brooklyn, and Manhattan.
                            </p>
                            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                <h4 className="font-bold text-blue-800">Registering Multiple Children?</h4>
                                <p className="text-blue-700">Parents, please fill out the registration form for EACH child. For example, if you are registering two children, you must submit the form twice.</p>
                            </div>
                        </div>
                    </AnimatedSection>
                </ContentSection>

                 {/* Impact Section */}
                <ContentSection className="bg-blue-600 text-white">
                    <AnimatedSection direction="down" className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">A Community of Learning</h2>
                        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">Last summer, our volunteer tutors dedicated thousands of hours to help students just like you.</p>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <AnimatedSection direction="left" className="bg-blue-700/50 p-8 rounded-xl text-center">
                            <div className="text-5xl font-extrabold"><CountUpNumber end={60} />+</div>
                            <div className="text-blue-200 mt-2">Dedicated Tutors</div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" className="bg-blue-700/50 p-8 rounded-xl text-center transition-delay-200">
                            <div className="text-5xl font-extrabold"><CountUpNumber end={200} />+</div>
                            <div className="text-blue-200 mt-2">Students Helped</div>
                        </AnimatedSection>
                        <AnimatedSection direction="right" className="bg-blue-700/50 p-8 rounded-xl text-center transition-delay-400">
                            <div className="text-5xl font-extrabold"><CountUpNumber end={1350} />+</div>
                            <div className="text-blue-200 mt-2">Hours of Tutoring</div>
                        </AnimatedSection>
                    </div>
                </ContentSection>
                
                {/* Parallax Section 2 */}
                <ParallaxSection imageUrl="/images/nyc.jpg">
                    <AnimatedSection>
                        <h2 className="text-4xl md:text-5xl font-bold shadow-text">
                            Dedicated to Student Success in NYC
                        </h2>
                    </AnimatedSection>
                </ParallaxSection>
                
                {/* Content Section 2: FAQ */}
                <ContentSection>
                     <AnimatedSection className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                            <p className="mt-3 text-lg text-gray-600">Have questions? We&apos;ve got answers.</p>
                        </div>
                        <div>
                            {faqData.map((faq, index) => (
                                <FaqItem key={index} faq={faq} isOpen={openFaqIndex === index} onClick={() => handleFaqClick(index)} />
                            ))}
                        </div>
                    </AnimatedSection>
                </ContentSection>
                
                {/* Parallax Section 3: Final CTA */}
                <ParallaxSection imageUrl="/images/books.jpg">
                    <AnimatedSection>
                        <h2 className="text-4xl md:text-5xl font-bold shadow-text">Ready to Get Started?</h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto shadow-text-sm">Take the first step towards a successful school year. Sign up for free tutoring today!</p>
                        <div className="mt-8">
                             <a href="https://docs.google.com/forms/d/e/1FAIpQLSe6W0ZYjSN0mUidZax7HInvQvBnC8fGSDLPVkim4oPnaZTHPw/viewform" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center">
                                Sign Me Up! <ArrowRight className="ml-2" size={20} />
                            </a>
                        </div>
                    </AnimatedSection>
                </ParallaxSection>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10 relative z-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-semibold text-lg text-white">Stuyvesant Summer Tutoring</p>
                    <p className="mt-4">For any questions, please email us at:</p>
                    <a href="mailto:stuysummertutoring@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">stuysummertutoring@gmail.com</a>
                    <p className="mt-2">or MESSAGE (do not call) David at (917)-602-0368.</p>
                    <p className="text-sm mt-6">&copy; {new Date().getFullYear()} Stuyvesant Summer Tutoring | David Lee, SST President &apos;25</p>
                </div>
            </footer>
        </div>
    );
}
