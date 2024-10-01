import React from "react";
import slide from "@/assets/slideTwo.svg";
import { PiStudentFill, PiFeatherFill } from "react-icons/pi";

const SlideTwo = () => {
  return (
    <div className="px-7 justify-center items-center pb-10 dark:bg-black">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 h-full p-4 flex flex-col items-center md:items-start justify-center">
          <h2 className="text-4xl font-black mb-2 max-md:text-2xl dark:text-white">
            Unlock Infinite Knowledge
          </h2>

          <p className="text-black mb-2 mt-2 max-md:text-center max-md:text-xs dark:text-white">
            Craft compelling courses effortlessly with our platform, enabling
            you to create engaging content on any topic. Seamlessly integrate
            video and theory lectures for a comprehensive learning experience,
            fostering effective education in just a few clicks
          </p>

          <div className="flex flex-row justify-center mt-4">
            <div className="md:w-1/2 mb-2 md:mb-0  mx-2 max-md:text-center">
              <div className="max-md:flex max-md:justify-center max-md:items-center">
                <PiStudentFill className="text-2xl max-md:text-xl dark:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 max-md:text-xl dark:text-white">
                Study Online
              </h3>
              <p className="text-black max-md:text-xs dark:text-white">
                Video & Theory Lecture
              </p>
            </div>

            <div className="md:w-1/2 mb-2 md:mb-0 mx-2 max-md:text-center">
              <div className="max-md:flex max-md:justify-center max-md:items-center">
                <PiFeatherFill className="text-2xl max-md:text-xl dark:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 max-md:text-xl dark:text-white">
                Create Course
              </h3>
              <p className="text-black max-md:text-xs dark:text-white">
                Create Course on Any Topic
              </p>
            </div>
          </div>
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
  );
};

export default SlideTwo;
