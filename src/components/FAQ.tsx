
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-viridian/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-viridian transition-colors group"
      >
        <h3 className="text-lg md:text-xl font-serif text-viridian-dark group-hover:text-viridian transition-colors">
          {question}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-viridian transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[#576574] leading-relaxed">
              <span className="font-bold text-viridian-dark">The Answer:</span> {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What are the times for the livestream classes?",
      answer: "In order to facilitate a busy lifestyle, two (2) livestream sessions will be hosted per weekday. While all participants are invited to attend at least one of these, they are absolutely welcome to attend them both. The first session is at 7:00am EST, while the second session is at 8:00pm EST."
    },
    {
      question: "How do I reach out if I have any questions?",
      answer: "All inquiries can be addressed to the contact email \"charles@toyl.ca\". Responses will be provide within 24 hours."
    },
    {
      question: "I’m not flexible at all—can I actually do this?",
      answer: "Being 'too stiff for yoga' is like being 'too dirty for a shower.' This challenge isn't for people who can already touch their toes; it’s for the people who can’t. We focus on functional mobility—opening up your hips, back, and shoulders so you can move through your real life without pain. Every pose includes 'modifications,' meaning you go exactly as far as your body allows today. You don't need to be flexible to start; you just need to be willing to breathe."
    },
    {
      question: "Do I need any special equipment or a lot of space?",
      answer: "If you have enough floor space to lie down, you have enough space for TOYL Yoga. While a yoga mat is helpful for grip, it’s not required. You don't need fancy 'yoga clothes,' blocks, or straps. Most of our participants do these 20-minute sessions in their pajamas or workout gear right in their living room or office. We’ve removed every barrier so you can just hit play and move."
    },
    {
      question: "If I find myself falling behind, how can I catch up?",
      answer: "First, give yourself grace—Life always does what it does, and this happens to everyone at some time. If you fall behind, we recommend the 'Double-Down' or the 'Weekend Bridge.' You can either do two 20-minute sessions back-to-back (one in the morning, one in the evening) or use our scheduled 'Weekend Breaks' to catch up on the sessions you missed during the week."
    },
    {
      question: "How do I keep myself motivated?",
      answer: "When your drive to persist is waning, we suggest you stop looking at the mountain and just look at the mat. Tell yourself: 'I’m just going to roll out the mat and stand on it for 2 minutes', and celebrate doing this. Usually though, once you’re there, the body takes over and you may practice for a bit. Celebrate this too. Remember, we are about persistence, and not perfection."
    }
  ];

  return (
    <div id="faq" className="max-w-3xl mx-auto">
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
