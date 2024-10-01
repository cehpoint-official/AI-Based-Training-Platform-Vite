import React from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import Logo from "@/assets/errorday.gif";
import LogoNight from "@/assets/errornight.gif";

const Error = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header isHome={false} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        {sessionStorage.getItem("darkMode") === "true" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              alt="img"
              src={LogoNight}
              className="mb-4 h-80 w-80 max-md:h-64 max-md:w-64"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              alt="img"
              src={Logo}
              className="mb-4 h-80 w-80 max-md:h-64 max-md:w-64"
            />
          </div>
        )}
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Error;
