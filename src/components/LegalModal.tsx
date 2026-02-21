
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-viridian-dark/60 backdrop-blur-sm z-[100] cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-viridian/10 flex justify-between items-center bg-viridian-soft">
              <h2 className="text-2xl font-serif text-viridian-dark">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-viridian/10 rounded-full transition-colors text-viridian"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-[#576574] leading-relaxed space-y-6">
              {content}
            </div>
            <div className="p-6 border-t border-viridian/10 bg-viridian-soft flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-viridian text-white rounded-full font-medium hover:bg-viridian-dark transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
