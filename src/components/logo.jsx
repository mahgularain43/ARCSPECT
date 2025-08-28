import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollYProgress } = useScroll();

  // Hero logo moves DOWN instead of up
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.25]); 
  const logoX = useTransform(scrollYProgress, [0, 0.3], ["0vw", "-40vw"]); 
  const logoY = useTransform(scrollYProgress, [0, 0.3], ["0vh", "20vh"]); // Moves down instead of up

  return (
    <motion.img
      src="/src/assets/logo.png"
      alt="ARCSPECT Logo"
      className="absolute w-32 h-32 md:w-20 md:h-20"
      style={{ x: logoX, y: logoY, scale: logoScale }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
};

export default Logo;
