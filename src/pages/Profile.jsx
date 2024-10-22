import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footers from "../components/Footers";
import { Button, Label } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const Profile = () => {
  const [mName, setName] = useState(sessionStorage.getItem("mName"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [currentApiKey, setCurrentApiKey] = useState(
    sessionStorage.getItem("currentApiKey") || ""
  );
  const [showCurrentApiKey, setShowCurrentApiKey] = useState(false);

  const showToast = (msg) => {
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

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("currentApiKey");
    if (storedApiKey) {
      setCurrentApiKey(storedApiKey);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !mName) {
      showToast("Please fill in all required fields");
      return;
    }
    setProcessing(true);
    const uid = sessionStorage.getItem("uid");
    const postURL = `/api/profile`;
    try {
      const response = await axiosInstance.post(postURL, {
        email,
        mName,
        password,
        uid,
      });
      if (response.data.success) {
        showToast(response.data.message);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("mName", mName);
        setProcessing(false);
        setPassword("");
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      showToast("Internal Server Error");
    }
  };

  const handleSubmitApiKey = async (event) => {
    event.preventDefault();
    if (!newApiKey) {
      showToast("Please enter the new API key");
      return;
    }
    setProcessing(true);
    const uid = sessionStorage.getItem("uid");
    const postURL = `/api/profile`;
    try {
      const response = await axiosInstance.post(postURL, {
        email,
        mName,
        apiKey: newApiKey,
        uid,
      });
      if (response.data.success) {
        setCurrentApiKey(newApiKey);
        sessionStorage.setItem("currentApiKey", newApiKey);
        showToast(response.data.message);
        setProcessing(false);
        setNewApiKey("");
        setShowApiKeyForm(false);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      showToast("Internal Server Error");
    }
  };

  const handleChangeApiKey = () => {
    setNewApiKey("");
    setShowApiKeyForm(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10 flex-col">
          <div className="md:w-2/5 w-4/5 m-auto py-4 no-scrollbar ">
            <p className="text-center font-black text-4xl text-black dark:text-white">
              Profile
            </p>

            <div className="py-6">
              <Button
                onClick={() => {
                  setShowPasswordForm(true);
                  setShowApiKeyForm(false);
                }}
                className="mb-4 w-full dark:bg-white dark:text-black bg-black text-white font-bold rounded-none"
              >
                Change Password
              </Button>
              <Button
                onClick={handleChangeApiKey}
                className="mb-4 w-full dark:bg-white dark:text-black bg-black text-white font-bold rounded-none"
              >
                Manage Gemini API Key
              </Button>

              {showPasswordForm && (
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label
                        className="font-bold text-black dark:text-white"
                        htmlFor="password1"
                        value="New Password"
                      />
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                      id="password1"
                      type="password"
                    />
                  </div>
                  <Button
                    isProcessing={processing}
                    processingSpinner={
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                    className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              )}

              {showApiKeyForm && (
                <div>
                  <div className="mb-6">
                    <p className="font-bold text-black dark:text-white">
                      Current API Key:
                    </p>
                    <div className="flex items-center">
                      <input
                        type={showCurrentApiKey ? "text" : "password"}
                        value={currentApiKey}
                        readOnly
                        className="focus:ring-black focus:border-black border border-black bg-white dark:bg-black dark:border-white dark:text-white rounded-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentApiKey(!showCurrentApiKey)}
                        className="ml-2 text-blue-500 underline"
                      >
                        {showCurrentApiKey ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitApiKey}>
                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label
                          className="font-bold text-black dark:text-white"
                          htmlFor="newApiKey"
                          value="New Gemini API Key"
                        />
                      </div>
                      <input
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        className="focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                        id="newApiKey"
                        type="text"
                      />
                    </div>
                    <Button
                      isProcessing={processing}
                      processingSpinner={
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                      }
                      className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full"
                      type="submit"
                    >
                      Submit New Key
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Profile;
