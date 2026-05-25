import * as React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeIn } from '../../../utils/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={`relative w-full ${sizeClasses[size]} bg-background rounded-xl shadow-2xl max-h-[90vh] overflow-hidden`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
            
            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
