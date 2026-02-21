
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
      question: "I’m not flexible at all—can I actually do this?",
      answer: "Being 'too stiff for yoga' is like being 'too dirty for a shower.' This challenge isn't for people who can already touch their toes; it’s for the people who can’t. We focus on functional mobility—opening up your hips, back, and shoulders so you can move through your real life without pain. Every pose includes 'modifications,' meaning you go exactly as far as your body allows today. You don't need to be flexible to start; you just need to be willing to breathe."
    },
    {
      question: "What if I miss a day? Does that mean I failed the challenge?",
      answer: "Life happens. If you miss a Tuesday, you haven't 'failed.' You simply have a session waiting for you. The goal of the March Momentum is consistency, not perfection. Our 'Weekdays Only' schedule actually gives you the weekends to catch up if you had a hectic Tuesday. You have lifetime access to these videos, so the only way to fail is to never start."
    },
    {
      question: "Do I need any special equipment or a lot of space?",
      answer: "If you have enough floor space to lie down, you have enough space for TOYL Yoga. While a yoga mat is helpful for grip, it’s not required. You don't need fancy 'yoga clothes,' blocks, or straps. Most of our participants do these 20-minute sessions in their pajamas or workout gear right in their living room or office. We’ve removed every barrier so you can just hit play and move."
    },
    {
      question: "What if I miss the class?",
      answer: "There is no 'missing' a class because there are no live appointments to keep. Every daily 20-minute session is delivered directly to your inbox and stored in your private member portal. Whether you practice at 6:00 AM before the house wakes up or at 9:00 PM to decompress from the day, the session is ready when you are. You own the content, so you set the clock."
    },
    {
      question: "If I find myself falling behind, how can I catch up?",
      answer: "First, give yourself grace—the goal is a lifestyle, not a race. If you fall behind, we recommend the 'Double-Down' or the 'Weekend Bridge.' You can either do two 20-minute sessions back-to-back (one in the morning, one in the evening) or use our scheduled 'Weekend Breaks' to catch up on the sessions you missed during the week. Remember: doing 5 minutes of a missed session is always better than doing 0 minutes."
    },
    {
      question: "If I find myself wanting to give up, how can I remotivate myself?",
      answer: "Motivation is a feeling, and feelings fade. When your 'why' feels weak, stop looking at the mountain and just look at the mat. Tell yourself: 'I’m just going to roll out the mat and stand on it for 2 minutes.' Usually, once you’re there, the body takes over. Also, remember your Identity Shift: You aren't 'trying' to do yoga; you are the kind of person who prioritizes their health. Re-read the Daily Hook from that morning—it’s designed specifically to pull you back into the game when your brain tries to talk you out of it."
    },
    {
      question: "How do I reach out if I have any questions?",
      answer: "All inquiries can be addressed to the contact email 'charles@toyl.ca'. Responses will be provided within 24 hours."
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
