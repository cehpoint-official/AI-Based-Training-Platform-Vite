import React, { useEffect, useState } from "react";
import { Navbar } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import { name, websiteURL } from "../constants";
import DarkModeToggle from "./DarkModeToggle";
import LogoComponent from "./LogoComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const Header = ({ isHome }) => {
  const storedTheme = sessionStorage.getItem("darkMode");
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [firebase_id, setFirebase_id] = useState(sessionStorage.getItem("uid"));
  const [profileImg, setProfileImg] = useState(
    "https://firebasestorage.googleapis.com/v0/b/ai-based-training-platfo-ca895.appspot.com/o/user.png?alt=media&token=9c07ad9f-2390-4717-b83e-8af33a5da8d2"
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isHome && sessionStorage.getItem("uid") === null) {
      navigate("/signin");
    }
  });

  function redirectSignIn() {
    navigate("/signin");
  }
  function redirectAdmin() {
    sessionStorage.setItem("darkMode", false);
    navigate("/dashBoard");
  }
  function redirectFeatures() {
    navigate("/features");
  }
  function redirectSignUp() {
    navigate("/signup");
  }
  function redirectHome() {
    navigate("/home");
  }
  function redirectGenerate() {
    navigate("/create");
  }
  function redirectProfile() {
    navigate("/profile");
  }
  function redirectMyProject() {
    navigate("/myproject");
  }
  function redirectTest() {
    navigate("/testpage");
  }
  function Logout() {
    sessionStorage.clear();
    showToast("Logout Successful");
    redirectSignIn();
  }
  // function redirectPricing() {
  //   navigate('/pricing', { state: { header: true } });
  // }
  // function redirectPricingTwo() {
  //   navigate('/pricing', { state: { header: false } });
  // }

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/user/getProfile?uid=${firebase_id}`
      );

      if (response.data.success) {
        setProfileImg(response.data.userProfile.profile);
        if (response.data.userProfile.role === "admin") {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } else {
        console.error("Failed to fetch profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (firebase_id) {
      fetchProfile();
    }
  }, [firebase_id]);

  const showToast = async (msg) => {
    toast(msg, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Flowbite>
      {!isHome ? (
        <>
          <Navbar fluid className=" py-3 dark:bg-black">
            <Navbar.Brand href={websiteURL} className="ml-1">
              <LogoComponent isDarkMode={storedTheme} />
              <span className="self-center whitespace-nowrap text-2xl font-black dark:text-white ">
                {name}
                {/* AI COURSE CREATORS */}
              </span>
            </Navbar.Brand>
            <div className="flex md:hidden justify-center items-center">
              <DarkModeToggle className="inline-flex items-cente md:hidden" />
              <Navbar.Toggle className="inline-flex items-center rounded-lg p-2 text-sm text-black hover:bg-white focus:outline-none focus:ring-0 focus:ring-gray-200 dark:text-white dark:hover:bg-black dark:focus:ring-gray-600 md:hidden" />
            </div>
            <Navbar.Collapse>
              <div className="hidden md:flex justify-center items-center">
                <DarkModeToggle />
              </div>
              {/* <Navbar.Link className='border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white  hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white' style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '10px', paddingTop: '10px' }} onClick={redirectPricingTwo}>Pricing</Navbar.Link> */}
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white cursor-pointer"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={redirectFeatures}
              >
                Features
              </Navbar.Link>

              {firebase_id ? (
                <>
                  <div className="flex items-center justify-center">
                    <Navbar.Link
                      onClick={redirectHome}
                      className="border-b-0 text-black cursor-pointer
                  font-normal mb-2 mt-2 border-black dark:text-white dark:border-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white !border border-solid !px-3 !py-1" 
                    >
                      Get Started
                    </Navbar.Link>
                  </div>

                  <div className="w-8 aspect-square flex items-center justify-center">
                    <span className="w-8 aspect-square rounded-full bg-black dark:bg-white flex items-center justify-center">
                      <img
                        src={profileImg}
                        className="w-6 h-6 invert dark:invert-0"
                      />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Navbar.Link
                    onClick={redirectSignIn}
                    className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 border-black dark:text-white dark:border-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                    style={{
                      borderWidth: "1px",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      paddingBottom: "10px",
                      paddingTop: "10px",
                    }}
                  >
                    SignIn
                  </Navbar.Link>
                  <Navbar.Link
                    onClick={redirectSignUp}
                    className="border-b-0 text-white cursor-pointer  font-normal mb-2 mt-2 bg-black dark:text-black dark:bg-white  hover:bg-black dark:hover:bg-white md:dark:hover:bg-white md:hover:bg-black hover:text-white md:hover:text-white dark:hover:text-black dark:md:hover:text-black"
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      paddingBottom: "10px",
                      paddingTop: "10px",
                    }}
                  >
                    SignUp
                  </Navbar.Link>
                </>
              )}
            </Navbar.Collapse>
          </Navbar>
        </>
      ) : (
        <>
          <Navbar
            fluid
            className=" py-3 dark:bg-black border-b border-black dark:border-white"
          >
            <Navbar.Brand href={websiteURL} className="ml-1">
              <LogoComponent isDarkMode={storedTheme} />
              <span className="self-center whitespace-nowrap text-2xl font-black dark:text-white ">
                {name}
              </span>
            </Navbar.Brand>
            <div className="flex md:hidden justify-center items-center">
              <DarkModeToggle className="inline-flex items-cente md:hidden" />
              <Navbar.Toggle className="inline-flex items-center rounded-lg p-2 text-sm text-black hover:bg-white focus:outline-none focus:ring-0 focus:ring-gray-200 dark:text-white dark:hover:bg-black dark:focus:ring-gray-600 md:hidden" />
            </div>
            <Navbar.Collapse>
              <div className="hidden md:flex justify-center items-center">
                <DarkModeToggle />
              </div>
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white  hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={redirectHome}
              >
                Home
              </Navbar.Link>
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={redirectProfile}
              >
                Profile
              </Navbar.Link>
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={redirectMyProject}
              >
                My Project
              </Navbar.Link>
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={redirectTest}
              >
                Give Test
              </Navbar.Link>
              <Navbar.Link
                className="border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
                onClick={Logout}
              >
                Logout
              </Navbar.Link>
              {/* <Navbar.Link className='border-b-0 text-black cursor-pointer font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white' style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '10px', paddingTop: '10px' }} onClick={redirectPricing}>Pricing</Navbar.Link> */}
              {admin ? (
                <Navbar.Link
                  className="border-b-0 text-black cursor-pointer  font-normal mb-2 mt-2 dark:text-white hover:bg-white dark:hover:bg-black hover:text-black md:hover:text-black dark:hover:text-white dark:md:hover:text-white"
                  style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    paddingBottom: "10px",
                    paddingTop: "10px",
                  }}
                  onClick={redirectAdmin}
                >
                  Admin
                </Navbar.Link>
              ) : (
                <> </>
              )}
              <Navbar.Link
                onClick={redirectGenerate}
                className="border-b-0 text-white cursor-pointer font-normal mb-2 mt-2 bg-black dark:text-black dark:bg-white  hover:bg-black dark:hover:bg-white md:dark:hover:bg-white md:hover:bg-black hover:text-white md:hover:text-white dark:hover:text-black dark:md:hover:text-black"
                style={{
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
              >
                Generate Course
              </Navbar.Link>
            </Navbar.Collapse>
          </Navbar>
        </>
      )}
    </Flowbite>
  );
};

export default Header;
