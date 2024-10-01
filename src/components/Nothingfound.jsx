import React from "react";
import Logo from "@/assets/found.svg";

const NothingFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src={Logo}
        className="mb-4 h-80 w-80 max-md:h-64 max-md:w-64"
        alt="Nothing Found"
      />
      <p className="text-center font-black text-2xl max-md:text-xl text-black dark:text-white">
        Nothing Found
      </p>
    </div>
  );
};

export default NothingFound;
