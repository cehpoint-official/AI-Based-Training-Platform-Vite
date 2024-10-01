import React from "react";
import Header from "@/components/Header";
import Footers from "@/components/Footers";
import slide from "@/assets/about.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { company, name } from "../constants";

const About = () => {
  const navigate = useNavigate();

  function redirectContact() {
    navigate("/contact");
  }

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={false} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <h1 className="text-6xl font-black mt-14 max-md:text-3xl dark:text-white">
            About
          </h1>
          <p className="text-center text-black mt-6 max-w-2xl font-medium max-md:text-xs dark:text-white">
            Welcome to {name}, the cutting-edge AI Course generator brought to
            you by {company}!
          </p>
        </div>
        <div className="px-7 max-md:px-3 justify-center items-center pb-10 dark:bg-black mt-14 ">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 h-full p-4 flex flex-col items-center md:items-start justify-center">
              <h2 className="text-4xl font-black mb-2 max-md:text-2xl dark:text-white">
                About Us
              </h2>
              <p className="text-black mb-2 mt-2 max-md:text-center max-md:text-xs dark:text-white">
                At {company}, we believe in the transformative power of
                education and the endless possibilities that Artificial
                Intelligence unlocks. That's why we've developed {name}, a
                revolutionary SaaS product designed to make course creation
                seamless, efficient, and intelligent.
              </p>
            </div>
            <div className="md:w-1/2 h-full">
              <img
                src={slide}
                alt="Your Alt Text"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-20 max-md:px-3">
          <h1 className="text-center text-4xl font-black mt-14 max-md:text-2xl dark:text-white">
            Our Mission
          </h1>
          <p className="text-black mb-2 mt-8 text-center max-md:text-xs dark:text-white">
            CEH Point is an AI-driven learning platform designed to help
            individuals from any domain generate courses, engage in
            self-learning, complete projects, and earn certifications by
            answering quizzes. Upon earning a certification, learners are
            offered a two-month internship, followed by further training and job
            opportunities. Our mission is to empower college students and
            graduates with essential skills through project-based learning,
            hands-on assessments, and personalized training that bridge the gap
            between education and employment. By leveraging cutting-edge tools,
            we aim to prepare individuals for the tech-driven job market,
            fostering a generation of professionals ready to excel in their
            careers and become an integral part of our company and team.
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-20 max-md:px-3">
          <h1 className="text-center text-4xl font-black mt-20 max-md:text-2xl dark:text-white">
            Join Us on the Learning Journey
          </h1>
          <p className="text-black mb-2 mt-8 text-center max-md:text-xs dark:text-white">
            We aim to provide a platform where students, graduates, and
            professionals can learn, build practical projects, and enhance their
            skills independently. After earning a certification, our company
            offers a two-month unpaid internship with mentorship and support.
            Upon successful completion of the internship, candidates will
            undergo a four-month training program with a stipend. Those who
            complete the training will have the opportunity for full-time
            employment with us, creating a remarkable journey from fresher to
            skilled employee.
          </p>
          <Button
            onClick={redirectContact}
            className="max-w-xs my-10 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent"
          >
            Contact
          </Button>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default About;
