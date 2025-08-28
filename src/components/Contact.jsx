import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

import { styles } from "../styles";
import { EarthCanvas, StarsCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate before sending
    if (!form.name || !form.email || !form.message) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          toast.success("Message sent successfully!");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          toast.error("Something went wrong. Please try again.");
        }
      );
  };
  
  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Contact Form & Globe Wrapper */}
      <div className="relative z-20 flex flex-row justify-center items-center w-full h-full px-6 md:px-20 gap-10">
        {/* Contact Form Box (Properly Centered) */}
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="w-full max-w-2xl bg-black bg-opacity-70 p-10 rounded-xl shadow-lg backdrop-blur-md flex flex-col justify-center items-center"
        >
          {/* Form Section */}
          <div className="w-full rounded-[20px] shadow-2xl"  style={{
        background: "linear-gradient(180deg, #0a0a0a,rgb(2, 41, 28))" ,marginLeft: "50px",
      }}>
            <p className="text-green-400 font-medium text-center">Get in Touch</p>
            <h3 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h3>

            <form ref={formRef} onSubmit={handleSubmit} className="text-green-400 font-medium text-center">
            <div className="contact-details text-left text-white space-y-4"style={ {marginLeft:"50px"}}>
          <div><strong>Phone:</strong> +1 (123) 456-7890</div>
          <div><strong>Email:</strong> support@arcspect.com</div>
          <div><strong>Address:</strong> 1234 Arc Lane, Design City, DX 56789</div>
        </div>
      
              <label className="flex flex-col">
                <span className="text-white font-medium mb-1"style={{ width: "350px", height: "25px", marginLeft: "270px"}}>Your Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={{ width: "350px", height: "25px", marginLeft: "400px"}}
                  className="bg-gray-400 py-3 px-4 placeholder-gray-400 text-green-400 font-medium text-center"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-white font-medium mb-1"style={{ width: "350px", height: "25px", marginLeft: "270px"}}>Your Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{ width: "350px", height: "25px", marginLeft: "400px"}}
                  className="bg-gray-800 py-3 px-4 placeholder-gray-400 text-green-400 font-medium text-center"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-white font-medium mb-1"style={{ width: "350px", height: "25px", marginLeft: "280px"}}>Your Message</span>
                <textarea
                  rows={4}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here"
                  style={{ width: "350px", height: "100px", marginLeft: "400px"}}
                  className="bg-gray-800 py-3 px-4 placeholder-gray-400 text-green-400 font-medium text-center"
                />
              </label>

              <button style={{ width: "200px", height: "20px", marginTop: "10px", marginBottom:"20px", marginLeft:"500px"}}
                type="submit"
                className="bg-green-600 py-3 px-6 rounded-lg outline-none text-white font-bold shadow-md w-full text-lg hover:bg-green-700 transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
           
      
    
            </form>
          </div>
        </motion.div>

        {/* 3D Earth Globe (Properly Positioned) */}
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="w-full lg:w-[40%] h-[500px] flex justify-center items-center"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
