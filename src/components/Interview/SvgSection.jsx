import React from "react";
import Typewriter from "typewriter-effect";

const SvgSection = ({ image }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-gray-300 p-4 md:p-10 rounded-lg">
      {/* Auto-Typing Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
        <Typewriter
          options={{
            strings: [
              "Prepare for Your Next Big Interview",
              "Ace Every Test with Confidence",
              "Your Dream Job Awaits!",
            ],
            autoStart: true,
            loop: true,
            delay: 60,
            deleteSpeed: 40,
          }}
        />
      </h2>

      {/* Motivational Quote */}
      <p className="text-sm md:text-base text-gray-600 italic text-center mb-6">
        "The best preparation for tomorrow is doing your best today." <br/> – *H. Jackson Brown, Jr.*
      </p>

      {/* SVG Image */}
      <img
        src={image}
        alt="Background Illustration"
        className="w-full h-auto md:w-auto md:h-2/5 object-contain"
      />
    </div>
  );
};

export default SvgSection;
