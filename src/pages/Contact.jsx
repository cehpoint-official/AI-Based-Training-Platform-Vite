import React, { useState } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { Button, Label } from "flowbite-react";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

import { AiOutlineLoading } from "react-icons/ai";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [msg, setMsg] = useState("");

  const showToast = async (msg) => {
    setProcessing(false);
    setFname("");
    setLname("");
    setEmail("");
    setPhone("");
    setMsg("");
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

  async function contactSubmit(e) {
    e.preventDefault();
    if (!email || !phone || !fname || !lname || !msg) {
      showToast("Please fill in all required fields");
      return;
    }
    const postURL = "/api/contact";
    try {
      setProcessing(true);
      const response = await axiosInstance.post(postURL, {
        fname,
        lname,
        email,
        phone,
        msg,
      });
      if (response.data.success) {
        showToast(response.data.message);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      showToast("Internal Server Error");
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10">
          <form
            onSubmit={contactSubmit}
            className="max-w-sm m-auto py-4 no-scrollbar"
          >
            <p className="text-center font-black text-4xl text-black dark:text-white">
              Contact
            </p>
            <p className="text-center font-normal text-black py-4 dark:text-white">
              Enter your details and ask your query
            </p>
            <div className="py-6">
              <div className="mb-6 flex flex-row max-md:flex-col md:space-x-3 max-md:space-y-3">
                <div>
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="name1"
                      value="First Name"
                    />
                  </div>
                  <input
                    onChange={(e) => setFname(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="name1"
                    type="text"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="name2"
                      value="Last Name"
                    />
                  </div>
                  <input
                    onChange={(e) => setLname(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="name2"
                    type="text"
                  />
                </div>
              </div>
              <div className="mb-6 flex flex-row max-md:flex-col md:space-x-3 max-md:space-y-3">
                <div>
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
                <div>
                  <div className="mb-2 block">
                    <Label
                      className="font-bold text-black dark:text-white"
                      htmlFor="phone1"
                      value="Phone"
                    />
                  </div>
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                    id="phone1"
                    type="number"
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="mb-2 block">
                  <Label
                    className="font-bold text-black dark:text-white"
                    htmlFor="msg1"
                    value="Message"
                  />
                </div>
                <textarea
                  onChange={(e) => setMsg(e.target.value)}
                  className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white h-28"
                  id="msg1"
                  type="text"
                />
              </div>
              <Button
                type="submit"
                isProcessing={processing}
                processingSpinner={
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />
                }
                className="my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Contact;
