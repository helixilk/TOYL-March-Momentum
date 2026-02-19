
import React, { useState, useEffect } from 'react';
import { generateYogaIntention } from '../services/geminiService';

const DailyIntention: React.FC = () => {
  const [intention, setIntention] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchIntention = async () => {
    setLoading(true);
    const text = await generateYogaIntention();
    setIntention(text);
    setLoading(false);
  };

  useEffect(() => {
    fetchIntention();
  }, []);

  return (
    <div className="bg-[#F1F7F5] border border-[#007F5F]/20 p-8 rounded-3xl max-w-2xl mx-auto my-12 text-center shadow-sm">
      <span className="text-xs uppercase tracking-[0.2em] text-[#007F5F] font-bold mb-4 block">Daily Intention Generator</span>
      <h3 className="text-2xl italic font-serif text-[#004B3E] mb-6 min-h-[3rem]">
        {loading ? "Seeking clarity..." : `"${intention}"`}
      </h3>
      <button 
        onClick={fetchIntention}
        disabled={loading}
        className="text-sm font-medium text-[#007F5F] underline underline-offset-4 hover:text-[#004B3E] disabled:opacity-50"
      >
        Refresh Intention
      </button>
    </div>
  );
};

export default DailyIntention;
