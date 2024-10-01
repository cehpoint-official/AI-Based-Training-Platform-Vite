import React, { useEffect, useState } from "react";
import img from "@/assets/forgot.svg";
import { Flowbite, Navbar } from "flowbite-react";
import { Button, Label } from "flowbite-react";
import { name, serverURL, websiteURL, company, logo } from "../constants";
import DarkModeToggle from "../components/DarkModeToggle";
import LogoComponent from "../components/LogoComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";

const ForgotPassword = () => {
  const storedTheme = sessionStorage.getItem("darkMode");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const navigate = useNavigate();
  function redirectSignUp() {
    navigate("/signin");
  }

  useEffect(() => {
    function redirectHome() {
      navigate("/home");
    }

    if (sessionStorage.getItem("auth")) {
      redirectHome();
    }

    let timer;

    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

  const showToast = async (msg) => {
    setProcessing(false);
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

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please fill in all required fields");
      return;
    }
    const postURL = serverURL + "/api/forgot";
    try {
      setProcessing(true);
      const response = await axios.post(postURL, {
        email,
        name,
        company,
        logo,
      });
      if (response.data.success) {
        showToast(response.data.message);
        setSeconds(60);
        setIsTimerRunning(true);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      showToast("Internal Server Error");
    }
  };

  return (
    <Flowbite>
      <div className="flex h-screen dark:bg-black no-scrollbar">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <Navbar fluid className="p-8 dark:bg-black">
            <Navbar.Brand href={websiteURL} className="ml-1">
              <LogoComponent isDarkMode={storedTheme} />
              <span className="self-center whitespace-nowrap text-2xl font-black dark:text-white ">
                {name}
              </span>
            </Navbar.Brand>
            <DarkModeToggle />
          </Navbar>

          <form
            onSubmit={handleReset}
            className="max-w-sm m-auto py-9 no-scrollbar"
          >
            <h1 className="text-center font-black text-5xl text-black dark:text-white">
              Forgot Password
            </h1>
            <p className="text-center font-normal text-black py-4 dark:text-white">
              Enter the registered email and a reset link will be sent to that
              email
            </p>

            <div className="py-10">
              <div className="mb-6">
                <div className="mb-2 block">
                  <Label
                    className="font-bold text-black dark:text-white"
                    htmlFor="email1"
                    value="Email"
                  />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                  id="email1"
                  type="email"
                />
              </div>

              <Button
                disabled={isTimerRunning}
                isProcessing={processing}
                processingSpinner={
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />
                }
                className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
                type="submit"
              >
                Submit
              </Button>
              <p
                hidden={!isTimerRunning}
                className="text-center font-normal text-black py-2 dark:text-white"
              >
                Resend link again in {formattedTime} seconds
              </p>
              <p
                onClick={redirectSignUp}
                className="text-center font-normal text-black underline py-4  dark:text-white"
              >
                Already know password? SignIn
              </p>
            </div>
          </form>
        </div>

        <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50 dark:bg-white">
          <img
            src={img}
            className="h-full bg-cover bg-center p-9"
            alt="Background"
          />
        </div>
      </div>
    </Flowbite>
  );
};

export default ForgotPassword;
