import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HouseCanvas } from "./canvas";

const textVariants = {
  hidden: { opacity: 0, y: 20, letterSpacing: "0.05em" },
  visible: { opacity: 1, y: 0, letterSpacing: "0em", transition: { duration: 1, ease: "easeOut" } }
};

const Hero = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleGetStarted = () => {
    navigate("/login"); // 🚀 Always redirect to Login Page
  };

  return (
    <section
      className="relative w-[99%] h-screen mx-auto flex flex-col justify-center items-center text-center text-white overflow-hidden rounded-t-[20px] shadow-2xl"
    >
      {/* Logo */}
      <motion.img
        src="/src/assets/logo.png"
        alt="ARCSPECT Logo"
        className="w-2 h-2 md:w-4 md:h-4 mb-1"
        style={{ width: "220px", height: "160px" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Animated Text */}
      <motion.div initial="hidden" animate="visible" variants={textVariants}>
        <h2
          className="text-4xl md:text-6xl font-bold mt-1 relative z-10 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #00674F, #4B9886, #0A5D4A, #B7D4CD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          3D HOME-DESIGN MODELS
        </h2>

        <p
          className="text-lg mt-2 font-semibold"
          style={{
            backgroundImage: "linear-gradient(to right, #00674F, #4B9886, #0A5D4A, #B7D4CD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Transform Your Vision into Reality
        </p>

        <p className="text-md mt-4 text-gray-300">
          From concept to creation, explore our state-of-the-art 3D design models
        </p>
      </motion.div>

      {/* Buttons Section with Proper Spacing */}
      <motion.div
        className="mt-12 flex justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        {/* Get Started Button - Always Redirects to Login Page */}
        <button
          style={{ width: "200px", height: "50px", marginRight: "100px" }}
          className="bg-[#0A3C30E5] hover:bg-[#264d3a] px-400 py-4 text-white rounded-lg shadow-lg text-lg font-bold"
          onClick={handleGetStarted}
        >
          Get Started
        </button>

        {/* Explore Button */}
        <button
          style={{ width: "200px", height: "50px" }}
          className="bg-[#0A3C30E5] hover:bg-[#264d3a] px-400 py-4 text-white rounded-lg shadow-lg text-lg font-bold"
          onClick={() => navigate('/explore')}
        >
          Explore
        </button>
      </motion.div>
    </section>
  );
};
export default Hero;




