import React, { useEffect, useState } from "react";
import img from "@/assets/signin.svg";
import { Flowbite, Navbar } from "flowbite-react";
import { Button, Label } from "flowbite-react";
import { mainname, name, subname, websiteURL } from "../constants";
import DarkModeToggle from "../components/DarkModeToggle";
import LogoComponent from "../components/LogoComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignUpButton from "../components/buttons/GoogleSignUpButton";
import axiosInstance from "../axios";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const auth = getAuth();
  const storedTheme = sessionStorage.getItem("darkMode");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function redirectSignUp() {
    navigate("/signup");
  }

  function redirectForgot() {
    navigate("/forgot");
  }

  function redirectHome() {
    navigate("/home");
  }

  useEffect(() => {
    if (sessionStorage.getItem("auth")) {
      redirectHome();
    }
    // eslint-disable-next-line
  }, []);

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

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all required fields");
      return;
    }
    const postURL = `/api/signin`;

    try {
      setProcessing(true);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseUid = user.uid;

      // Send sign-in request to your server
      const res = await axiosInstance.post(postURL, { email, password, firebaseUid });
      // console.log(res.data);
      if (res.data.success) {
        showToast(res.data.message);
        sessionStorage.setItem("user", JSON.stringify(res.data.userData));
        sessionStorage.setItem("email", res.data.userData.email);
        sessionStorage.setItem("mName", res.data.userData.mName);
        sessionStorage.setItem("auth", true);
        sessionStorage.setItem("type", res.data.userData.type);
        sessionStorage.setItem("uid", res.data.userData.uid); // Use the updated uid
        sessionStorage.setItem("uapiKey",res.data.userData.unsplashApiKey);
        sessionStorage.setItem("userapikey1", res.data.userData.userapikey1 || null);
        sessionStorage.setItem("apiKey", res.data.userData.apiKey || null);
        // Check if both userapikey1 and userapikey2 are null
        if (!res.data.userData.userapikey1 && !res.data.userData.userapikey2) {
          showToast("please fill out the api keys");
        } else if (!res.data.userData.userapikey1) {
          showToast("Gemini Key is not set.");
        } else if (!res.data.userData.userapikey2) {
          showToast("Unsplash Key is not set.");
        }
        redirectHome();
      } else {
        showToast(res.data.message);
      }
    } catch (error) {
      // console.error("Error:", error.message);
      showToast("Sign-in failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="<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>">
      <Flowbite>
        <div className="flex h-screen dark:bg-black no-scrollbar">
          <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
            <Navbar fluid className="p-8 dark:bg-black">
              <Navbar.Brand href={websiteURL} className="ml-1">
                <LogoComponent isDarkMode={storedTheme} />
                <span className="self-center whitespace-nowrap text-2xl flex items-start justify-center flex-col font-black dark:text-white ">
                <h1 className="font-black">{mainname}</h1>
                <em className="text-sm font-semibold">{subname}</em>
              </span>
              </Navbar.Brand>
              <DarkModeToggle />
            </Navbar>

            <form
              onSubmit={handleSignin}
              className="max-w-sm m-auto py-9 no-scrollbar"
            >
              <h1 className="text-center font-black text-5xl text-black dark:text-white">
                SignIn
              </h1>
              <p className="text-center font-normal text-red-600 py-4 dark:text-red-400 animate-pulse">
                Email and password login is temporarily unavailable.
              </p>

              <div className="py-5 max-md:px-10">
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="email1"
                      value="Email"
                      disabled={true}
                    />
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="email1"
                    type="email"
                    disabled={true}
                  />
                </div>
                <div className="mb-4">
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="password1"
                      value="Password"
                      disabled={true}
                      
                    />
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="password1"
                    type="password"
                    disabled={true}
                  />
                </div>
                <div className="flex items-center mb-7">
                  <button
                    onClick={redirectForgot}
                    className={`text-center font-normal text-black underline dark:text-white disabled:text-gray-400 dark:disabled:text-gray-400`}
                    disabled={true}
                  >
                    Forgot Password ?
                  </button>
                </div>
                <Button
                  isProcessing={processing}
                  processingSpinner={
                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                  }
                  className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
                  type="submit"
                  disabled={true}
                >
                  Submit
                </Button>

                <div className="text-center pt-5">
                  <GoogleSignUpButton
                    text="Sign in with Google"
                    showToast={showToast}
                    navigate={navigate}
                  />
                </div>

                <p
                  onClick={redirectSignUp}
                  className="text-center font-normal text-black underline py-4  dark:text-white"
                >
                  Don't have an account ? SignUp
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
    </GoogleOAuthProvider>
  );
};

export default SignIn;
