
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import LiquidBackground from './components/LiquidBackground';

const ScrollIndicator: React.FC<{ targetId: string }> = ({ targetId }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.5, duration: 1.5 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group z-20"
    onClick={() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    <span className="text-[10px] uppercase tracking-[0.8em] font-light text-white/20 animate-ethereal-text group-hover:text-orange-400 transition-colors">
      Scroll
    </span>
    <div className="relative flex flex-col items-center">
      <div className="w-[1.5px] h-[1.5px] bg-white/40 rounded-full mb-1 animate-pulse-glow"></div>
      <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 via-white/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent animate-ethereal-slide"></div>
      </div>
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroTranslate = scrollY * 0.4;

  const projects = [
    { title: "MediVenture", category: "System", desc: "Drug Inventory & Management System." },
    { title: "X-Ray Technician", category: "Platform", desc: "Service Platform for X-Ray Technicians." }
  ];

  const experiences = [
    {
      year: "2025",
      groups: [
        { role: "Winner", items: ["Pitch Your Idea 3.0"] },
        { role: "Finalist / Participant", items: ["National Level CTFs", "CTF BizBytes (College Level)", "SIH (Smart India Hackathon)", "AzinHack (Team Lead)", "Xcelerate 3.0", "AIHealth X", "Code X (College Hackathon)"] },
        { role: "Attendee", items: ["Buildspace Workshop (IGDTUW)", "Be 10x AI Workshop"] }
      ]
    },
    {
      year: "2024",
      groups: [
        { role: "Attendee", items: ["Full Stack Web Dev Workshop"] }
      ]
    }
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f97316', '#ffffff', '#a855f7', '#3b82f6'],
      spread: 70,
      ticks: 200
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      // EmailJS Configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey ||
        serviceId === 'your_service_id_here' ||
        templateId === 'your_template_id_here' ||
        publicKey === 'your_public_key_here') {
        alert('Please configure your EmailJS keys in .env.local');
        setIsSubmitting(false);
        return;
      }

      const templateParams = {
        // Standard fields (matches default templates)
        name: formData.name,
        email: formData.email,
        notes: formData.message,

        // Custom fields (matches our setup)
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Priyanshu Das',
      };

      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          setIsSubmitting(false);
          setIsSubmitted(true);
          fireConfetti();
          setFormData({ name: '', email: '', message: '' });
          setTimeout(() => setIsSubmitted(false), 5000);
        }, (err) => {
          console.log('FAILED...', err);
          setIsSubmitting(false);
          alert('Failed to send message. Please try again later.');
        });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const revealVariants = {
    hidden: { y: 60, opacity: 0, filter: 'blur(20px)', rotateX: 45 },
    visible: {
      y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0,
      transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] as any }
    }
  };

  const sublineVariants = {
    hidden: { opacity: 0, y: 20, letterSpacing: '1em' },
    visible: {
      opacity: 1, y: 0, letterSpacing: '0.4em',
      transition: { duration: 2, ease: [0.19, 1, 0.22, 1] as any, delay: 0.6 }
    }
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory relative selection:bg-orange-500 selection:text-white bg-black">
      <LiquidBackground />

      {/* --- SECTION 1: HERO --- */}
      <section id="hero" className="relative h-screen snap-start flex flex-col items-center z-10 overflow-hidden perspective-1000">
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <motion.div
            style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}
            className="transition-transform duration-75 ease-out"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-hidden mb-6">
              <motion.h2 variants={revealVariants} className="text-white/40 text-[11px] uppercase tracking-[0.6em] font-light">
                Priyanshu Das / Portfolio 2024
              </motion.h2>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-serif text-white mb-8 leading-[0.9] drop-shadow-2xl">
              <div className="overflow-hidden py-2">
                <motion.span variants={revealVariants} className="block">Hello!</motion.span>
              </div>
              <div className="overflow-hidden -mt-2 md:-mt-4 py-2">
                <motion.span variants={revealVariants} className="block italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/40">
                  I'm Priyanshu Das
                </motion.span>
              </div>
            </h1>
            <div className="overflow-hidden mt-4">
              <motion.p variants={sublineVariants} className="text-xs md:text-sm text-white/50 uppercase tracking-[0.4em] font-light">
                Vibe Coder & AI Prompt Engineer
              </motion.p>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator targetId="expertise" />
      </section>

      {/* --- SECTION 2: EXPERTISE --- */}
      <section id="expertise" className="relative h-screen snap-start z-10 px-6 border-t border-white/5 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-6">Education</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white text-xl font-serif italic leading-tight">Bachelors of Computer Science Engineering</h4>
                    <p className="text-white/40 text-[11px] tracking-widest mt-1">Maharaja Agrasen Institute of Technology • 2024 - 2028</p>
                    <p className="text-white/40 text-[11px] tracking-widest mt-1">Specialization in Artificial intelligence and machine learning</p>
                  </div>
                  <div>
                    <h4 className="text-white text-xl font-serif italic leading-tight">Completed Schooling</h4>
                    <p className="text-white/40 text-[11px] tracking-widest mt-1">M R V Model School</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5">
                <h3 className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-4">The Philosophy</h3>
                <p className="text-white/50 leading-relaxed font-light text-base max-w-sm">
                  I believe code should <span className="text-white italic">breathe</span>. Every interaction is an opportunity to evoke a sense of wonder.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-2xl">
              <h3 className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-8">Expertise Stack</h3>
              <ul className="space-y-6">
                {[
                  { label: 'Core Stack', val: 'HTML / CSS / JS / CPP' },
                  { label: 'Gen AI', val: 'Prompt Engineering' },
                  { label: 'Next Gen', val: 'Antigravity / Vibe Coding' },
                  { label: 'Design', val: 'Canva / Stitch' }
                ].map((item, i) => (
                  <li key={i} className="group">
                    <span className="text-orange-500/60 text-[9px] uppercase tracking-widest block mb-1">{item.label}</span>
                    <div className="text-white text-lg font-serif italic group-hover:text-orange-400 transition-colors leading-tight">{item.val}</div>
                    <div className="h-[1px] w-full bg-white/5 mt-3"></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <ScrollIndicator targetId="work" />
      </section>

      {/* --- SECTION 3: WORK --- */}
      <section id="work" className="relative h-screen snap-start z-10 px-6 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <h2 className="text-5xl md:text-7xl font-serif text-white">The Work</h2>
            <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] mb-2">Selected Experiments</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8 pr-6 md:border-r border-white/5">
              <h3 className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-6">Achievements</h3>
              {experiences.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l border-white/10 group mb-8 last:mb-0">
                  <div className="absolute top-0 left-[-3px] w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-orange-500 transition-colors"></div>
                  <span className="text-[12px] text-orange-500 font-bold uppercase tracking-widest block mb-3">{exp.year}</span>
                  <div className="space-y-4">
                    {exp.groups.map((group, j) => (
                      <div key={j}>
                        <h4 className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-1">{group.role}</h4>
                        <ul className="space-y-1">
                          {group.items.map((item, k) => (
                            <li key={k} className="text-white text-sm font-serif italic leading-tight hover:text-orange-400 transition-colors cursor-default">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {projects.map((proj, i) => (
                <div key={i} className="group relative p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-serif text-white italic leading-tight">{proj.title}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-orange-500">{proj.category}</span>
                  </div>
                  <p className="text-white/40 text-[11px] font-light leading-relaxed">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ScrollIndicator targetId="contact" />
      </section>

      {/* --- SECTION 4: CONTACT --- */}
      <section id="contact" className="relative h-screen snap-start z-10 px-6 overflow-hidden flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-5xl md:text-[6rem] font-serif text-white italic mb-10 leading-none">
            Let's Connect
          </h2>

          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-12 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl"
                >
                  <h3 className="text-3xl font-serif text-white italic mb-4">Sync Successful</h3>
                  <p className="text-white/40 text-sm font-light">Your signal has been received. Standing by.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl text-left space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 block ml-1">Name</label>
                        <input
                          type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 block ml-1">Email</label>
                        <input
                          type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@email.com"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-white/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 block ml-1">Message</label>
                      <textarea
                        rows={2} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Project details or just a hello..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-white/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all active:scale-[0.98]"
                    >
                      {isSubmitting ? 'Syncing...' : 'Broadcast'}
                    </button>

                    <div className="pt-4 flex items-center justify-center gap-8 border-t border-white/5">
                      <a href="https://www.instagram.com/priyanshudas607/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-orange-500 transition-colors" title="Instagram">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </a>
                      <a href="https://github.com/PriyanshuDas607" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-orange-500 transition-colors" title="GitHub">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      </a>
                      <a href="https://www.linkedin.com/in/priyanshu-das-919a1a302/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-orange-500 transition-colors" title="LinkedIn">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                      <a href="https://x.com/PriyanshuDas27" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-orange-500 transition-colors" title="Twitter">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                      </a>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ethereal-text {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50% { opacity: 0.25; transform: translateY(-2px); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes ethereal-slide {
          0% { transform: translateY(-100%); opacity: 0; }
          40%, 60% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        .animate-ethereal-text { animation: ethereal-text 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-ethereal-slide { animation: ethereal-slide 4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
        section { scroll-snap-align: start; }
      `}</style>
    </div>
  );
};

export default App;
