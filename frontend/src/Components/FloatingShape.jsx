import React from "react";
import { motion } from "framer-motion";

const FloatingShape = () => {
  const bubbles = [
    { color: "bg-green-500", size: "w-64 h-64", top: "-5%", left: "10%", delay: 0, duration: 20 },
    { color: "bg-emerald-500", size: "w-48 h-48", top: "70%", left: "80%", delay: 5, duration: 22 },
    { color: "bg-lime-500", size: "w-32 h-32", top: "40%", left: "-10%", delay: 2, duration: 18 },
    { color: "bg-teal-400", size: "w-24 h-24", top: "85%", left: "60%", delay: 3, duration: 16 },
    { color: "bg-green-400", size: "w-16 h-16", top: "90%", left: "30%", delay: 1, duration: 14 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${bubble.color} ${bubble.size} opacity-25 blur-xl`}
          style={{ top: bubble.top, left: bubble.left }}
          animate={{
            y: ["0%", "-120%"], // bubbles float up
            x: ["0%", "10%", "-10%", "0%"], // slight side drift
            scale: [1, 1.2, 0.9, 1], // expand/shrink
          }}
          transition={{
            duration: bubble.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: bubble.delay,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default FloatingShape;
