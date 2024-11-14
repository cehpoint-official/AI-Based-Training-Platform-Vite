import React from "react";
import Logo from "@/assets/logo.svg";
import DarkLogo from "@/assets/darkLogo.svg";
import { mainname, subname, websiteURL } from "../constants";
import { Navbar } from "flowbite-react";

const CourseLogoComponent = ({ isDarkMode }) => {
  function redirectHome() {
    window.location.href = websiteURL;
  }

  return (
    <Navbar>
      <div className="flex items-center justify-start -ml-3">
        <img
          alt="logo"
          src={isDarkMode === "true" ? DarkLogo : Logo}
          className="mr-3 h-9 cursor-pointer"
          onClick={redirectHome}
        />
        <Navbar.Brand href={websiteURL} className="flex flex-col items-start text-white">
          <h1 className="text-2xl font-black dark:text-white">{mainname}</h1>
          <em className="text-xs font-semibold">{subname}</em>
        </Navbar.Brand>
      </div>
    </Navbar>
  );
};

export default CourseLogoComponent;
