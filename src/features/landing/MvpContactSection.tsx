'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SquareParticleField, SquareParticleFieldHandle } from '@/components/SquareParticleField';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MvpContactSectionProps {
  id?: string;
  isStandalonePage?: boolean;
}

export const MvpContactSection: React.FC<MvpContactSectionProps> = ({
  id = 'contact',
  isStandalonePage = false,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const magneticSubmitBtnRef = useRef<HTMLButtonElement | null>(null);
  const particleFieldRef = useRef<SquareParticleFieldHandle | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    moveType: 'residential',
    fromZip: '',
    toZip: '',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Staggered Contact Form Entrance Timeline
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      contactTl
        .from('.contact-description', {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        })
        .from(
          '.contact-field',
          {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          '.contact-submit-btn',
          {
            scale: 0.92,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.2'
        );

      // Magnetic Button Effect on Submit Button
      const button = magneticSubmitBtnRef.current;
      if (button) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(button, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.4,
            ease: 'power3.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
          });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          button.removeEventListener('mousemove', handleMouseMove);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-[#0c0c0c] text-white relative overflow-hidden ${
        isStandalonePage ? 'py-12' : 'py-16 sm:py-24 border-t border-neutral-800'
      }`}
    >
      {/* Background Interactive Square Particle/Tile Field */}
      <SquareParticleField
        ref={particleFieldRef}
        gridSpacing={44}
        interactionRadius={175}
        redRatio={0.06}
        className="z-0"
      />

      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none z-[1]" />

      {/* Anchor for #contact */}
      {id !== 'contact' && <span id="contact" className="absolute top-0 pointer-events-none" />}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline & Station Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <TextReveal
                as="h2"
                className="contact-title display-heading display-heading--section text-white"
              >
                Your possessions are in reliable hands.
              </TextReveal>

              <p className="contact-description text-gray-300 text-base leading-relaxed">
                Connect directly with our central dispatch coordinators at Station 1. We review floorplans, schedule pre-move inspections, and deliver guaranteed written proposals with no hidden surprises.
              </p>
            </div>

            {/* Station Contact Badges */}
            <div className="space-y-3 sm:space-y-4 pt-4 border-t border-neutral-800 text-sm text-gray-300">
              <a
                href="tel:9725399588"
                className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-red-500/40 transition-colors"
              >
                <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-900 text-red-400 shrink-0">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-gray-400 font-mono">Direct Dispatch Line</div>
                  <div className="font-bold text-white text-sm sm:text-base">(972) 539-9588</div>
                </div>
              </a>

              <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-[#141414] border border-neutral-800">
                <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-900 text-red-400 shrink-0">
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-gray-400 font-mono">Station 1 & Station 2 HQ</div>
                  <div className="font-bold text-white text-xs sm:text-sm">Lewisville, TX • DFW Operations Hub</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Staggered Lead & Move Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#141414] border border-neutral-700/80 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 sm:pb-4">
                <h3 className="font-bold text-base sm:text-lg text-white">Request Official Relocation Proposal</h3>
                <span className="text-[11px] sm:text-xs text-red-400 font-mono font-semibold shrink-0">● Live Dispatch</span>
              </div>

              {isSubmitted ? (
                <div className="p-6 sm:p-8 bg-neutral-900 border border-red-500/40 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
                  <h4 className="font-bold text-xl text-white">Proposal Request Received</h4>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. A lead dispatch coordinator is reviewing your move requirements and will contact you shortly at <strong>{formData.phone}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(972) 539-9588"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Move Category</label>
                      <select
                        value={formData.moveType}
                        onChange={(e) => setFormData({ ...formData, moveType: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="residential">Residential Home / Apt</option>
                        <option value="commercial">Commercial / Office</option>
                        <option value="packing">Full Packing & Crating</option>
                        <option value="storage">Vault Storage & Moving</option>
                        <option value="specialty">Heavy Piano / Safe</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Origin ZIP / City</label>
                      <input
                        type="text"
                        placeholder="e.g. Frisco, TX (75034)"
                        value={formData.fromZip}
                        onChange={(e) => setFormData({ ...formData, fromZip: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="contact-field space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Destination ZIP / City</label>
                      <input
                        type="text"
                        placeholder="e.g. Plano, TX (75024)"
                        value={formData.toZip}
                        onChange={(e) => setFormData({ ...formData, toZip: e.target.value })}
                        className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="contact-field space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Move Details / Questions</label>
                    <textarea
                      rows={3}
                      placeholder="Special items, preferred dates, stairs, elevators..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                    />
                  </div>

                  <div className="contact-submit-btn pt-3">
                    <button
                      ref={magneticSubmitBtnRef}
                      type="submit"
                      className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Proposal Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MvpContactSection;
