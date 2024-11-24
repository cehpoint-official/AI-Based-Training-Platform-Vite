import React from "react";
import slide from "@/assets/slideOne.png";
import { useNavigate } from "react-router-dom";

const SlideOne = () => {
  const navigate = useNavigate();

  function redirectSignIn() {
    navigate("/signin");
  }
  function redirectSignUp() {
    navigate("/signup");
  }

  return (
    <div className="flex flex-col items-center dark:bg-black">
      <h1 className="text-4xl max-md:text-2xl font-black text-center mt-20 max-xl:px-4 dark:text-white">
        AI Learning Made Easy: Get Certified, Get Hired, Get Ahead
      </h1>

      <p className="text-center text-1xl text-black mt-6 max-w-1xl font-medium max-md:text-xs dark:text-white mx-20 max-md:mx-6">
        {/* Revolutionize your learning journey with our AI Course Generator SaaS
                Effortlessly create engaging and personalized courses tailored to your needs */}
        learning experience with our AI-powered platform designed for students,
        graduates, and professionals. We focus on self-paced, project-based
        learning that sharpens your skills and prepares you for real-world
        challenges. Whether you're aiming to upskill, prepare for internships,
        or transition into a new career, our platform offers tailored learning
        paths, assessments, and certification programs. With advanced AI tools
        like ChatGPT for personalized training, Canva for creative design, and
        Leonardo for visual innovation, you're equipped to achieve success in
        the evolving job market.
      </p>

      <div className="flex space-x-4 mb-8 mt-6">
        <button
          onClick={redirectSignIn}
          className="border-black text-black border px-3 py-2 font-medium dark:border-white dark:text-white"
        >
          SignIn
        </button>
        <button
          onClick={redirectSignUp}
          className="bg-black text-white px-3 py-2 font-medium dark:bg-white dark:text-black"
        >
          SignUp
        </button>
      </div>

      <img
        src={slide}
        alt="Your Alt Text"
        // className="w-full max-w-screen-xl mx-auto my-10 md:my-10"
        className="w-100%"
      />
    </div>
  );
};

export default SlideOne;
