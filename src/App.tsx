
import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Play, Calendar, Clock, Users, Instagram, Twitter, Facebook } from 'lucide-react';
import Button from './components/Button';
import SectionHeading from './components/SectionHeading';
import DailyIntention from './components/DailyIntention';
import { STRIPE_PLACEHOLDER_URL } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-viridian/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-viridian rounded-full"></div>
            <span className="font-serif font-bold text-xl tracking-tight text-viridian-dark">TOYL YOGA</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-viridian-dark/80">
            <a href="#how-it-works" className="hover:text-viridian transition-colors">How it Works</a>
            <a href="#about" className="hover:text-viridian transition-colors">About</a>
            <a href="#benefits" className="hover:text-viridian transition-colors">Benefits</a>
            <Button href={STRIPE_PLACEHOLDER_URL} className="px-5 py-2 text-xs">JOIN FOR $27</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F1F7F5] -z-10 rounded-bl-[200px] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-viridian/10 text-viridian text-xs font-bold uppercase tracking-widest">
              Available Now: March Momentum
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-viridian-dark leading-[1.1]">
              Find Your <br />
              <span className="italic text-viridian">Flow</span> in 20.
            </h1>
            <p className="text-xl text-[#576574] leading-relaxed max-w-lg">
              Unlock consistency and mobility with our 20-day, 20-minute daily practice. Designed for weekdays, built for real life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={STRIPE_PLACEHOLDER_URL} className="text-lg flex items-center justify-center gap-2">
                JOIN NOW — $27 CAN <ArrowRight className="w-5 h-5" />
              </Button>
              <Button href="#how-it-works" variant="outline" className="text-lg">Learn More</Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-[#576574]">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i + 20}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="Yoga practitioner" referrerPolicy="no-referrer" />
                ))}
              </div>
              <span>Join 200+ mindful practitioners</span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Yoga practice"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-viridian-dark/40 to-transparent"></div>
            </div>
            {/* Floating Stats */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-viridian/10"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-viridian" />
                <div>
                  <div className="text-2xl font-serif text-viridian font-bold">20m</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#576574]">Per Session</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-viridian/10"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-viridian" />
                <div>
                  <div className="text-2xl font-serif text-viridian font-bold">20 Days</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#576574]">Progression</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-[#F8FAF9]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="The 20-20 Blueprint" 
            subtitle="March 2nd to March 27th. We provide the structure; you provide the presence."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { 
                step: "01", 
                title: "Weekdays Only", 
                desc: "Consistency is key, but so is recovery. We host live and on-demand classes Monday through Friday, leaving your weekends free for rest and reflection.",
                icon: <Calendar className="w-6 h-6" />
              },
              { 
                step: "02", 
                title: "20-Minute Focus", 
                desc: "Short enough to fit into a busy schedule, long enough to transform your mobility. Every session is targeted, intentional, and high-impact.",
                icon: <Clock className="w-6 h-6" />
              },
              { 
                step: "03", 
                title: "Lifetime Access", 
                desc: "Can't make the livestream? No problem. Every class is recorded and available on-demand, so you can maintain your momentum whenever you choose.",
                icon: <Play className="w-6 h-6" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-viridian/5"
              >
                <div className="w-12 h-12 bg-viridian/10 rounded-2xl flex items-center justify-center text-viridian font-serif text-2xl font-bold mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif text-viridian-dark mb-4">{item.title}</h3>
                <p className="text-[#576574] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Motivation Component */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <DailyIntention />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1000&auto=format&fit=crop" 
              className="rounded-[3rem] shadow-2xl" 
              alt="Yoga lifestyle"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-viridian/10 rounded-full -z-10 blur-3xl"></div>
          </div>
          <div className="space-y-6">
            <SectionHeading title="A Practice, Not a Task" centered={false} />
            <p className="text-lg text-[#576574] leading-relaxed">
              At TOYL (Time Of Your Life) Yoga, we believe that fitness shouldn't be a chore you "get through." Instead, it should be a "required" lifestyle practice—as essential to your day as your morning coffee.
            </p>
            <p className="text-lg text-[#576574] leading-relaxed">
              March Momentum is designed to bridge the gap between sporadic exercise and a lifelong commitment to mobility. For just $27, you aren't just buying classes; you're investing in a new rhythm for your life.
            </p>
            <div className="pt-6">
              <Button href={STRIPE_PLACEHOLDER_URL}>RESERVE YOUR MAT</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-viridian text-white rounded-[4rem] mx-6 mb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Why March Momentum?</h2>
            <p className="text-white/80 max-w-2xl mx-auto">Discover the transformation that happens when you commit to yourself for 20 days straight.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Enhanced Mobility", desc: "Unlock joints and increase range of motion with yoga specifically tailored for functional movement.", icon: <Users className="w-6 h-6" /> },
              { title: "Mental Clarity", desc: "Start your morning or end your day with 20 minutes of pure presence and mindful breathing.", icon: <Clock className="w-6 h-6" /> },
              { title: "Habit Formation", desc: "Science shows 20 days is the threshold for making a new practice feel automatic and required.", icon: <Calendar className="w-6 h-6" /> },
              { title: "Community Energy", desc: "Practice alongside a global community, sharing the collective momentum and support.", icon: <Users className="w-6 h-6" /> }
            ].map((benefit, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold">{benefit.title}</h3>
                <p className="text-white/70 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-5xl md:text-6xl font-serif text-viridian-dark">Ready to start your <br /><span className="italic text-viridian">March Momentum?</span></h2>
          <p className="text-xl text-[#576574] leading-relaxed">
            The program starts on March 2nd. Don't let another month pass without prioritizing your mobility. Join us for just $27 CAN.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button href={STRIPE_PLACEHOLDER_URL} className="text-2xl px-12 py-6">SECURE MY SPOT — $27</Button>
            <p className="text-sm text-[#576574] font-medium italic">Weekday classes • March 2nd to 27th • Livestream & On-Demand</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-viridian-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <span className="font-serif font-bold text-2xl tracking-tight">TOYL YOGA</span>
              </div>
              <p className="text-white/60 max-w-sm">
                Time Of Your Life Yoga. Dedicated to helping you incorporate movement into your everyday life through accessible, premium mobility practices.
              </p>
              <div className="flex gap-4">
                <Instagram className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Program</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About TOYL</a></li>
                <li><a href={STRIPE_PLACEHOLDER_URL} className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/40 text-xs">
            © {new Date().getFullYear()} TOYL YOGA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
