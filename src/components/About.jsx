import React, { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const creators = [
  {
    name: "Mahgul Wahid",
    image: "/static/creators/M.png",
    bio: "Lead designer turning architectural dreams into reality.",
  },
    {
    name: "Barirah Bakhtiar",
    image: "/static/creators/cr1.png",
    bio: "Backend Developer and co-creator of ARCSPECT.",
  }
];

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "About ARCSPECT",
      bg: "bg-[#223634]",
      content: (
        <>
          <h2 className="text-5xl font-extrabold mb-6">About ARCSPECT</h2>
          <p className="text-lg mb-4 max-w-xl">
            ARCSPECT helps homeowners and architects visualize 3D designs before construction begins.
            Our smart layout tools and design team ensure creativity meets precision.
          </p>
          <p className="text-lg max-w-xl">
            Whether it's your first home or a professional project, we’re here to make your vision real.
          </p>
        </>
      ),
    },
    {
      title: "Meet the Creators",
      bg: "bg-[#1a1a1a]",
      content: (
        <>
          <h2 className="text-4xl font-bold mb-10"style={{ marginBottom:"50px"}}>Meet the Creators</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {creators.map((c, i) => (
              <div key={i} className="flex flex-col items-center text-center w-[282px] space-y-4"style={{ marginTop:"10px"}}>
                <p className="text-xl font-bold text-white"style={{ marginBottom:"10px"}}>{c.name}</p>
                <div className="w-48 h-64 border-4 border-white rounded-b-[50px] rounded-t-[10px] overflow-hidden shadow-lg"style={{ width: "200px", height: "310px",  }}>
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-300 mt-2">{c.bio}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Why ARCSPECT?",
      bg: "bg-[#223634]",
      content: (
        <>
          <h2 className="text-4xl font-bold mb-6">Why Choose Us?</h2>
          <ul className="text-lg list-disc list-inside text-left max-w-md space-y-2">
            <li>✔️ 3D layout precision with AI assistance</li>
            <li>✔️ Professional and intuitive design tools</li>
            <li>✔️ Affordable and scalable services</li>
          </ul>
        </>
      ),
    },
  ];

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative p-4 rounded-[100px]">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`min-w-full h-full flex justify-center items-center p-4 ${slide.bg} rounded-3xl overflow-hidden mx-2 shadow-2xl`}
          >
            <div className="text-white p-10 w-full max-w-6xl h-[90%] flex flex-col justify-center items-center text-center rounded-[30px]">
              {slide.content}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#065b42] hover:bg-green-600 text-white p-4 rounded-full z-50"
        title="Previous"
      >
        <FaArrowLeft size={24} />
      </button>

      <button
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#065b42] hover:bg-green-600 text-white p-4 rounded-full z-50"
        title="Next"
      >
        <FaArrowRight size={24} />
      </button>
    </div>
  );
};

export default About;
