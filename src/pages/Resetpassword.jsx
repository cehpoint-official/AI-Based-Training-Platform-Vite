import React, { useEffect, useState } from "react";
import img from "@/assets/reset.svg";
import { Flowbite, Navbar } from "flowbite-react";
import { Button, Label } from "flowbite-react";
import { name, websiteURL, company, logo } from "../constants";
import DarkModeToggle from "../components/DarkModeToggle";
import LogoComponent from "../components/LogoComponent";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import axiosInstance from "../axios";

const ResetPassword = () => {
  const storedTheme = sessionStorage.getItem("darkMode");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  function redirectSignIn() {
    navigate("/signin");
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

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmpassword) {
      showToast("Please fill in all required fields");
      return;
    } else if (password !== confirmpassword) {
      showToast("The password and confirm password do not match");
      return;
    } else if (password.length < 9) {
      showToast("Password should be at least 9 characters");
      return;
    }
    const postURL = "/api/reset-password";

    try {
      setProcessing(true);
      const response = await axiosInstance.post(postURL, { password, token });
      if (response.data.success) {
        showToast(response.data.message);
        sendEmail(response.data.email);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      showToast("Internal Server Error");
    }
  };

  async function sendEmail(mEmail) {
    const signInLink = websiteURL + "/signin";
    try {
      const dataToSend = {
        subject: `${name} Password Updated`,
        to: mEmail,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
                 <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Password Updated<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                 </div>
                
                  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                      <tr style="width:100%">
                        <td>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                            <tbody>
                              <tr>
                                <td><img alt="Vercel" src="${logo}" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                              </tr>
                            </tbody>
                          </table>
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Password Updated</h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Your account ${mEmail} has had its password updated.</p>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                            <tbody>
                              <tr>
                                <td><a href="${signInLink}" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"</span><span>SignIn</span></a></td>
                              </tr>
                            </tbody>
                          </table>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Best,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>${company}</strong> Team</p></p>
                          </td>
                      </tr>
                    </table>
                  </body>
                
                </html>`,
      };
      const postURL = "/api/mail/data";
      await axiosInstance
        .post(postURL, dataToSend)
        .then((res) => {
          redirectSignIn();
        })
        .catch((error) => {
          redirectSignIn();
        });
    } catch (error) {
      redirectSignIn();
    }
  }

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
              Reset Password
            </h1>
            <p className="text-center font-normal text-black py-4 dark:text-white">
              Enter your new password
            </p>

            <div className="py-10">
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
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label
                    className="font-bold text-black dark:text-white"
                    htmlFor="password2"
                    value="Confirm Password"
                  />
                </div>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                  id="password2"
                  type="password"
                />
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

export default ResetPassword;
