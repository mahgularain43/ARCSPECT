import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  // Function to handle scrolling
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false); // Hide navbar when scrolling down
    } else {
      setShowNavbar(true); // Show navbar when scrolling up
    }
    setLastScrollY(window.scrollY);
  };

  // Add event listener for scrolling
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ✅ Function to Scroll to Sections Smoothly
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -80 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-2 flex justify-center transition-all duration-300"
      style={{ marginTop: "50px", marginLeft: "100px" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex justify-between items-center px-4 lg:px-20"
      >
       {/* Home Button */}
<button
  style={{ marginLeft: "870px", borderColor: "grey" }}
  className="w-[120px] h-[50px] bg-[#0A3C30E5] hover:bg-[#264d3a] text-white rounded-lg shadow-[inset_5px_5px_10px_rgba(0,0,0,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.1)] text-lg font-bold transition-all duration-200 rounded-[10px]"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  Home
</button>


        {/* About Us Button - Scroll to About Section */}
        <button
          style={{ marginLeft: "10px", borderColor: "grey" }}
          className="w-[120px] h-[50px] bg-[#0A3C30E5] hover:bg-[#264d3a] text-white rounded-lg shadow-[inset_5px_5px_10px_rgba(0,0,0,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.1)] text-lg font-bold transition-all duration-200 rounded-[10px]"
          onClick={() => scrollToSection("about")}
        >
          About Us
        </button>

        {/* Contact Us Button - Scroll to Contact Section */}
        <button
          style={{ marginLeft: "10px", borderColor: "grey" }}
          className="w-[120px] h-[50px] bg-[#0A3C30E5] hover:bg-[#264d3a] text-white rounded-lg shadow-[inset_5px_5px_10px_rgba(0,0,0,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.1)] text-lg font-bold transition-all duration-200 rounded-[10px]"
          onClick={() => scrollToSection("contact")}
        >
          Contact Us
        </button>


        {/* Sign-Up Button with User Icon */}
        <button
          style={{ marginLeft: "10px", borderColor: "grey" }}
          className="w-[120px] h-[50px] flex items-center justify-center bg-[#0A3C30E5] hover:bg-[#264d3a] text-white rounded-lg shadow-[inset_5px_5px_10px_rgba(0,0,0,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.1)] text-lg font-bold transition-all duration-200 rounded-[10px]"
          onClick={() => navigate("/signup")}
        >
          Sign Up <FaUserCircle className="ml-2 text-2xl" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
