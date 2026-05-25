// Shared Framer Motion variants from blueprint

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } }
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "backOut" } }
};

export const drawerSlide = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { type: "spring", stiffness: 300, damping: 32 } },
  exit: { x: "100%", transition: { duration: 0.22, ease: "easeIn" } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.02, 
    y: -4, 
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    transition: { duration: 0.25, ease: "easeOut" }
  }
};

export const quickViewButton = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

export const bounceScale = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export const accordionContent = {
  hidden: { height: 0, opacity: 0 },
  show: { 
    height: "auto", 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

export const filterChip = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};
