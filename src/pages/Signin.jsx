// import React, { useEffect, useState } from 'react';
// import img from '../../src/res/img/signin.svg';
// import { Flowbite, Navbar } from 'flowbite-react';
// import { Button, Label } from 'flowbite-react';
// import { name,  websiteURL } from '../constants';
// import DarkModeToggle from '../components/DarkModeToggle';
// import LogoComponent from '../components/LogoComponent';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { AiOutlineLoading } from 'react-icons/ai';

// const SignIn = () => {

//     const storedTheme = sessionStorage.getItem('darkMode');
//     const [email, setEmail] = useState('');
//     const [processing, setProcessing] = useState(false);
//     const [password, setPassword] = useState('');

//     const navigate = useNavigate();
//     function redirectSignUp() {
//         navigate("/signup");
//     }

//     function redirectForgot() {
//         navigate("/forgot");
//     }

//     function redirectHome() {
//         navigate("/home");
//     }

//     useEffect(() => {

//         if (sessionStorage.getItem('auth')) {
//             redirectHome();
//         }
// // eslint-disable-next-line
//     }, []);

//     const showToast = async (msg) => {
//         setProcessing(false);
//         toast(msg, {
//             position: "bottom-center",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined
//         });
//     }

//     const handleSignin = async (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             showToast('Please fill in all required fields');
//             return;
//         }
//         // const postURL =  '/api/signin';
//         const postURL = `/api/profile`;
//         try {
//             setProcessing(true);
//             const response = await axios.post(postURL, { email, password });
//             if (response.data.success) {
//                 showToast(response.data.message);
//                 sessionStorage.setItem('email', response.data.userData.email);
//                 sessionStorage.setItem('mName', response.data.userData.mName);
//                 sessionStorage.setItem('auth', true);
//                 sessionStorage.setItem('uid', response.data.userData._id);
//                 sessionStorage.setItem('type', response.data.userData.type);
//                 redirectHome();
//             } else {
//                 showToast(response.data.message);
//             }
//         } catch (error) {
//             // if (error.response && error.response.status === 404) {
//             //     showToast('Resource not found. Please check the URL.');
//             // }

//             // else {
//             //     console.error('Error:', error.response || error.message);
//             //     showToast('Internal Server Error');
//             // }
//             showToast('Try again');
//         }
//     };

//     return (
//         <Flowbite>
//             <div className="flex h-screen dark:bg-black no-scrollbar">

//                 <div className="flex-1 overflow-y-auto no-scrollbar">

//                     <Navbar fluid className='p-8 dark:bg-black'>
//                         <Navbar.Brand href={websiteURL} className="ml-1">
//                             <LogoComponent isDarkMode={storedTheme} />
//                             <span className="self-center whitespace-nowrap text-2xl font-black dark:text-white ">{name}</span>
//                         </Navbar.Brand>
//                         <DarkModeToggle />
//                     </Navbar>

//                     <form onSubmit={handleSignin} className="max-w-sm m-auto py-9 no-scrollbar">

//                         <h1 className='text-center font-black text-5xl text-black dark:text-white'>SignIn</h1>
//                         <p className='text-center font-normal text-black py-4 dark:text-white'>Enter email & password to continue</p>

//                         <div className='py-10'>
//                             <div className='mb-6'>
//                                 <div className="mb-2 block">
//                                     <Label className="font-bold text-black dark:text-white" htmlFor="email1" value="Email" />
//                                 </div>
//                                 <input onChange={(e) => setEmail(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="email1" type="email" />
//                             </div>
//                             <div className='mb-4'>
//                                 <div className="mb-2 block">
//                                     <Label className="font-bold text-black dark:text-white" htmlFor="password1" value="Password" />
//                                 </div>
//                                 <input onChange={(e) => setPassword(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="password1" type="password" />
//                             </div>
//                             <div className="flex items-center mb-10">
//                                 <p onClick={redirectForgot} className='text-center font-normal text-black underline dark:text-white'>Forgot Password ?</p>
//                             </div>
//                             <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' type="submit">Submit</Button>
//                             <p onClick={redirectSignUp} className='text-center font-normal text-black underline py-4  dark:text-white'>Don't have an account ? SignUp</p>
//                         </div>

//                     </form>
//                 </div>

//                 <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50 dark:bg-white">
//                     <img
//                         src={img}
//                         className="h-full bg-cover bg-center p-9"
//                         alt="Background"
//                     />
//                 </div>
//             </div>
//         </Flowbite>
//     );
// };

// export default SignIn;

import React, { useEffect, useState } from "react";
import img from "@/assets/signin.svg";
import { Flowbite, Navbar } from "flowbite-react";
import { Button, Label } from "flowbite-react";
import { name, websiteURL } from "../constants";
import DarkModeToggle from "../components/DarkModeToggle";
import LogoComponent from "../components/LogoComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignUpButton from "../components/buttons/GoogleSignUpButton";

const SignIn = () => {
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
      const response = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(data.message);
        sessionStorage.setItem("email", data.userData.email);
        sessionStorage.setItem("mName", data.userData.mName);
        sessionStorage.setItem("auth", true);
        sessionStorage.setItem("uid", data.userData._id);
        sessionStorage.setItem("type", data.userData.type);
        redirectHome();
      } else {
        showToast(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      showToast("Try again");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="<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>">
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
              onSubmit={handleSignin}
              className="max-w-sm m-auto py-9 no-scrollbar"
            >
              <h1 className="text-center font-black text-5xl text-black dark:text-white">
                SignIn
              </h1>
              <p className="text-center font-normal text-black py-4 dark:text-white">
                Enter email & password to continue
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
                <div className="mb-4">
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="password1"
                      value="Password"
                    />
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="password1"
                    type="password"
                  />
                </div>
                <div className="flex items-center mb-10">
                  <p
                    onClick={redirectForgot}
                    className="text-center font-normal text-black underline dark:text-white"
                  >
                    Forgot Password ?
                  </p>
                </div>
                <Button
                  isProcessing={processing}
                  processingSpinner={
                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                  }
                  className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
                  type="submit"
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
