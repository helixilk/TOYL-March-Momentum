
import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Play, Calendar, Clock, Users } from 'lucide-react';
import Button from './components/Button';
import SectionHeading from './components/SectionHeading';
import DailyIntention from './components/DailyIntention';
import FAQ from './components/FAQ';
import LegalModal from './components/LegalModal';
import { STRIPE_PLACEHOLDER_URL } from './constants';

const LOGO_URL = "https://drive.google.com/thumbnail?id=13-VlkdL0_w7pGVJ186Orh_FoUCBtezos&sz=w1000";

const App: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);

  const termsContent = (
    <>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">1. Health & Safety Disclaimer</h3>
        <p>By participating in TOYL Yoga's 4-Week Mobility Challenge, you acknowledge that yoga and physical exercise involve inherent risks. You should consult with a physician before starting any new fitness program. You agree to participate at your own risk and represent that you are in good physical condition to do so. This program is for informational purposes and is not medical advice.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">2. Program Access</h3>
        <p>"Lifetime Access" refers to the duration that the TOYL Yoga platform remains operational. The 4-Week Mobility Challenge follows a weekday-only schedule (Monday-Friday). While we strive for 100% uptime, we are not responsible for temporary technical interruptions.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">3. Refund Policy</h3>
        <p>Due to the immediate access to digital content and the low-cost nature of this program ($27 CAN), all sales are final. No refunds will be issued once the transaction is complete.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">4. Intellectual Property</h3>
        <p>All videos, guides, and materials provided are the exclusive property of TOYL Yoga. Your purchase grants you a personal, non-transferable license. Redistribution, reselling, or public broadcasting of this content is strictly prohibited.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">5. Limitation of Liability</h3>
        <p>TOYL Yoga and its instructors shall not be liable for any injuries, damages, or losses resulting from your participation in the program or your inability to access the digital platform.</p>
      </section>
    </>
  );

  const privacyContent = (
    <>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">1. Data Collection</h3>
        <p>We collect your name and email address solely for the purpose of delivering the 4-Week Mobility Challenge program, providing access to our member portal, and processing your registration.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">2. Payment Processing</h3>
        <p>All payments are handled securely through Stripe. TOYL Yoga does not store, see, or have access to your full credit card information or sensitive financial data on our servers.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">3. Communication</h3>
        <p>By registering, you agree to receive program-related emails, including daily links and updates. You may opt-out of marketing communications at any time via the "unsubscribe" link in our emails.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">4. Third-Party Services</h3>
        <p>We share necessary data with trusted third-party providers (like Stripe for payments and our email service provider) only to the extent required to operate the program. We never sell your data to third parties.</p>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-viridian-dark">5. Cookies</h3>
        <p>We use essential cookies to manage your login sessions and ensure the member portal functions correctly. These are required for the basic operation of our service.</p>
      </section>
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-viridian/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src={LOGO_URL} alt="TOYL Yoga Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
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
        <div className="absolute top-0 right-0 w-1/2 h-full bg-viridian-light -z-10 rounded-bl-[200px] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-viridian/10 text-viridian text-xs font-bold uppercase tracking-widest">
              Available Now: 4-Week Mobility Challenge
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-viridian-dark leading-[1.1]">
              Find Your <br />
              <span className="italic text-viridian">Flow</span> in 20.
            </h1>
            <p className="text-xl text-[#576574] leading-relaxed max-w-lg">
              Unlock consistency and mobility with our 4-week, 20-minute daily practice. Designed for weekdays, built for real life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={STRIPE_PLACEHOLDER_URL} variant="gradient" className="text-base md:text-lg flex items-center justify-center gap-2 whitespace-nowrap flex-nowrap">
                <span>PRACTICE WITH US</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-[#576574]">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop"
                ].map((url, i) => (
                  <img key={i} src={url} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Yoga practitioner" referrerPolicy="no-referrer" />
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
                src="https://drive.google.com/thumbnail?id=1rwndSIOEVqCEmtNjRMVBA80OmdxpoaVF&sz=w1000" 
                className="w-full h-full object-cover" 
                alt="Mature man practicing yoga"
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
                  <div className="text-2xl font-serif text-viridian font-bold">4 Weeks</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#576574]">Progression</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Is this the program for you? Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <ul className="space-y-6">
              {[
                "Do you feel stiff, tight and much less mobile ...all from not able to find the time for exercise? Is your body is crying out to reclaim that command?",
                "Do you sometimes feel that a sudden 'unprepared for' movement, might results in 'straining' a muscle in your body? Have you become so 'risk averse, that you avoid unnecessary physical activity.",
                "Have you been injured in your past, and are now 'healed'? Do you worry about hurting yourself again and have become overly cautious with your physical activity?",
                "Are you 'older' person whose perceived expectation that your strength, mobility or balance is now limited or constrained by age? Do you also feel as if you are not ready to be \"put out to pasture\" yet?",
                "Were you pretty 'Active' in your youth and remember that feeling where your muscles worked seamlessly together to do something physically awesome? Would you like to feel that way again?"
              ].map((text, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 text-lg text-[#576574] leading-relaxed"
                >
                  <span className="text-viridian font-bold text-2xl leading-none">•</span>
                  <span>{text}</span>
                </motion.li>
              ))}
            </ul>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="text-xl font-serif text-viridian-dark font-bold pt-4"
            >
              If you identify with any of these descriptions above, then this program is for you.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1NAGeDlbA6gJyJTXpE0qFqjKd8hSj1nDu&sz=w1000" 
              className="rounded-[3rem] shadow-2xl aspect-[4/5] object-cover" 
              alt="Mature man stretching"
            />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-viridian/5 rounded-full -z-10 blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-viridian-soft">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="The 20-20 Blueprint" 
            subtitle="Instructor-Led or On-Demand. We provide the structure; you provide the presence."
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
              src="https://drive.google.com/thumbnail?id=1smX1m7y7HPQxeSkdQw4Vsyc2qiUeT8vl&sz=w1000" 
              className="rounded-[3rem] shadow-2xl" 
              alt="Mature man in yoga pose"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-viridian/10 rounded-full -z-10 blur-3xl"></div>
          </div>
          <div className="space-y-6">
            <SectionHeading title="A Practice, Not a Task" centered={false} />
            <p className="text-lg text-[#576574] leading-relaxed">
              At TOYL (Time Of Your Life) Yoga, we believe that fitness shouldn't be a chore you "get through." Instead, it should be a "required" lifestyle practice—as essential to your day as your morning coffee.
            </p>
            <p className="text-lg text-[#576574] leading-relaxed">
              Our 4-Week Mobility Challenge is designed to bridge the gap between sporadic exercise and a lifelong commitment to mobility. For just $27, you aren't just buying classes; you're investing in a new rhythm for your life.
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
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Why this Program</h2>
            <p className="text-white/80 max-w-2xl mx-auto">Discover the transformation that happens when you commit to yourself for 20 days straight.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { 
                title: "Escape the \"Gravity\" of Inactivity", 
                desc: "We aren't just aiming for a 'good month'; we are building a permanent exit strategy from the sedentary cycle. This isn't a temporary spark—it’s about shifting your baseline so that 'active' becomes your new default setting." 
              },
              { 
                title: "Confidence-Driven Progression", 
                desc: "Confidence isn’t found; it’s built through evidence. We proceed at a 'Goldilocks' pace—challenging enough to see real change, but supported enough to ensure you never feel out of your depth." 
              },
              { 
                title: "Rediscover \"Lost\" Ranges of Motion", 
                desc: "We carefully unlock the stiffness in your hips, spine, and shoulders to reclaim ranges of motion you thought were gone for good. It’s like finding a 'reset' button for your joints." 
              },
              { 
                title: "From Sedentary to Seamlessly Active", 
                desc: "The bridge between the couch and the life you actually want to live. This program is designed to be progressive and challenging, systematically dismantling the 'perceived limits' you’ve placed on yourself." 
              },
              { 
                title: "The Blueprint for Your Next \"Awesome\"", 
                desc: "Whether you want to hike, play with your grandkids, or simply wake up without a backache, we provide the 'kick-start' you need to help you do something physically awesome again." 
              }
            ].map((benefit, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-serif font-bold">{benefit.title}</h3>
                <p className="text-white/70 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Frequently Asked Questions" subtitle="Everything you need to know about the 4-week mobility challenge." />
          <FAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center bg-viridian-accent/30">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-5xl md:text-6xl font-serif text-viridian-dark">Ready to begin your <br /><span className="italic text-viridian">Practice?</span></h2>
          <p className="text-xl text-[#576574] leading-relaxed">
            Don't let another month pass without prioritizing your mobility. Join our 4-week program today for just $27 CAN.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button href={STRIPE_PLACEHOLDER_URL} variant="gradient" className="text-xl md:text-2xl px-8 md:px-12 py-4 md:py-6 whitespace-nowrap">SECURE MY SPOT — $27</Button>
            <p className="text-sm text-[#576574] font-medium italic">Weekday classes • Instructor-Led & On-Demand</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-viridian-dark text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-xl space-y-8">
              <div className="flex items-center gap-4">
                <img src={LOGO_URL} alt="TOYL Yoga Logo" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                <span className="font-serif font-bold text-3xl tracking-tight">TOYL YOGA</span>
              </div>
              <p className="text-white/60 text-lg leading-relaxed">
                Time Of Your Life Yoga. Dedicated to helping you incorporate movement into your everyday life through accessible, premium mobility practices. We believe consistency is the bridge between where you are and where you want to be.
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-white/40">Program</h4>
                <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-4 text-white/70 text-sm">
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                  <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About TOYL</a></li>
                  <li><a href="#faq-section" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
            <p>© {new Date().getFullYear()} TOYL YOGA. All rights reserved.</p>
            <div className="flex gap-8">
              <button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors cursor-pointer">Terms</button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        title="Terms of Service" 
        content={termsContent} 
      />
      <LegalModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        title="Privacy Policy" 
        content={privacyContent} 
      />
    </div>
  );
};

export default App;
