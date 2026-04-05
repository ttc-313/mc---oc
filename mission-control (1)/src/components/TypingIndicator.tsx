import React from 'react';
import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-[3px] rounded-full bg-[#2C2C2E] px-2.5 py-1.5 shadow-sm border border-[#3A3A3C] h-6">
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-[#8E8E93]"
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0,
        }}
      />
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-[#8E8E93]"
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-[#8E8E93]"
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.4,
        }}
      />
    </div>
  );
}
