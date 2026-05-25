import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { drawerSlide } from '../../../utils/animations';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, children, title, side = 'right' }: DrawerProps) {
  const slideVariants = {
    hidden: { x: side === 'right' ? '100%' : '-100%' },
    show: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 32 } },
    exit: { x: side === 'right' ? '100%' : '-100%', transition: { duration: 0.22, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />
          
          {/* Drawer Content */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={`absolute top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-full max-w-md bg-background shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="h-[calc(100%-73px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
