import React from "react";
import { Footer } from "flowbite-react";
import Logo from "@/assets/logo.svg";
import DarkLogo from "@/assets/darkLogo.svg";
import { company, websiteURL } from "../constants";
import { useNavigate } from "react-router-dom";

const Footers = () => {
  const storedTheme = sessionStorage.getItem("darkMode");

  const navigate = useNavigate();
  function redirectAbout() {
    navigate("/about");
  }
  function redirectContact() {
    navigate("/contact");
  }
  function redirectTerms() {
    navigate("/terms");
  }

  function redirectPrivacy() {
    navigate("/privacy");
  }

  return (
    <Footer container className="shadow-none rounded-none dark:bg-black">
      <div className="w-full text-center">
        <div className="w-full flex items-center justify-between">
          <Footer.Brand
            href={websiteURL}
            src={storedTheme === "true" ? DarkLogo : Logo}
            className="flex items-center justify-center"
          />
          <Footer.LinkGroup className="text-xs flex items-start justify-end -mt-3 font-semibold">
            <span className="flex items-start max-sm:flex-col justify-center gap-y-2">
              <p
                className="text-black font-bold mx-4 dark:text-white"
                onClick={redirectAbout}
              >
                About
              </p>
              <p
                className="text-black  font-bold  mx-4 dark:text-white"
                onClick={redirectPrivacy}
              >
                Privacy Policy
              </p>
            </span>
            <span className="flex items-start max-sm:flex-col justify-center gap-y-2">
              <p
                className="text-black  font-bold  mx-4 dark:text-white "
                onClick={redirectTerms}
              >
                Terms
              </p>
              <p
                className="text-black  font-bold  mx-4 dark:text-white"
                onClick={redirectContact}
              >
                Contact
              </p>
            </span>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider className="border-black dark:border-white" />
        <Footer.Copyright
          className="text-black dark:text-white text-xs font-semibold"
          href={websiteURL}
          by={company}
          year={2024}
        />
      </div>
    </Footer>
  );
};

export default Footers;
