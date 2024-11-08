import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footers from "../components/Footers";
import { Button, Label } from "flowbite-react";
import {
  AiOutlineFileImage,
  AiOutlineKey,
  AiOutlineLoading,
  AiOutlineLock,
} from "react-icons/ai";
import { toast } from "react-toastify";
import axiosInstance from "../axios";
import { getAuth } from "firebase/auth";

const Profile = () => {
  const auth = getAuth()
  // console.log(auth.currentUser)
  const [mName, setName] = useState(sessionStorage.getItem("mName"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [firebase_id, setFirebase_id] = useState(sessionStorage.getItem("uid"));
  // console.log(sessionStorage.getItem("uid"))
  const [profileImg, setProfileImg] = useState("https://firebasestorage.googleapis.com/v0/b/ai-based-training-platfo-ca895.appspot.com/o/user.png?alt=media&token=cdde4ad1-26e7-4edb-9f7b-a3172fbada8d");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [currentApiKey, setCurrentApiKey] = useState(
    sessionStorage.getItem("currentApiKey") || ""
  );
  const [showCurrentApiKey, setShowCurrentApiKey] = useState(false);

  const [showUnsplashApiKeyForm, setShowUnsplashApiKeyForm] = useState(false);
  const [newUnsplashApiKey, setNewUnsplashApiKey] = useState("");
  const [currentUnsplashApiKey, setCurrentUnsplashApiKey] = useState(
    sessionStorage.getItem("currentUnsplashApiKey") || ""
  );
  const [showCurrentUnsplashApiKey, setShowCurrentUnsplashApiKey] =
    useState(false);

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
    const storedApiKey = sessionStorage.getItem("apiKey");
    if (storedApiKey) {
      setCurrentApiKey(storedApiKey);
    }

    const userJsonString =sessionStorage.getItem("user");
    const user = JSON.parse(userJsonString);
    const storedUnsplashApiKey = user.unsplashApiKey;
    if (storedUnsplashApiKey) {
      setCurrentUnsplashApiKey(storedUnsplashApiKey);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/user/getProfile?uid=${firebase_id}`
      );

      if (response.data.success) {
        setProfileImg(response.data.userProfile.profile);
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

  const handleSubmitUnsplashApiKey = async (event) => {
    event.preventDefault();
    if (!newUnsplashApiKey) {
      showToast("Please enter the new Unsplash API key");
      return;
    }
    setProcessing(true);
    const uid = sessionStorage.getItem("uid");
    const postURL = `/api/profile`;
    try {
      const response = await axiosInstance.post(postURL, {
        email,
        mName,
        unsplashApiKey: newUnsplashApiKey,
        uid,
      });
      if (response.data.success) {
        setCurrentUnsplashApiKey(newUnsplashApiKey);
        sessionStorage.setItem("currentUnsplashApiKey", newUnsplashApiKey);
        showToast(response.data.message);
        setProcessing(false);
        setNewUnsplashApiKey("");
        setShowUnsplashApiKeyForm(false);
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

  const handleChangeUnsplashApiKey = () => {
    setNewUnsplashApiKey("");
    setShowUnsplashApiKeyForm(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />

      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10 flex-col">
          <div className="md:w-2/5 w-4/5 m-auto py-4 no-scrollbar">
            <h1 className="text-center font-black text-4xl text-black dark:text-white mb-12">
              Profile
            </h1>

            <div className="bg-gray-800 dark:bg-white/20 p-6 rounded-lg text-white flex items-center justify-between shadow-lg transition-transform transform ">
              <div className="flex items-center justify-start">
                <span className="bg-white rounded-lg aspect-square overflow-hidden w-20 shadow-md">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-20 h-20 object-cover transition-transform transform hover:scale-110"
                  />
                </span>
                <sapn className="ml-4">
                  <p className="text-xl font-bold uppercase">{mName}</p>
                  <p className="text-gray-300"><em>{email}</em></p>
                </sapn>
              </div>
              <Button className="bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition duration-200">
                Update
              </Button>
            </div>

            <div className="py-6">
              <h2 className="text-center text-2xl font-bold mb-6 text-black dark:text-white">
                Manage Your Account
              </h2>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setShowPasswordForm(true);
                    setShowApiKeyForm(false);
                    setShowUnsplashApiKeyForm(false);
                  }}
                  className="w-full bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <AiOutlineLock className="mr-2" />
                  Change Password
                </Button>

                <Button
                  onClick={handleChangeApiKey}
                  className="w-full bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
                >
                  <AiOutlineKey className="mr-2" />
                  Manage Gemini API Key
                </Button>

                <Button
                  onClick={handleChangeUnsplashApiKey}
                  className="w-full bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-200 flex items-center justify-center"
                >
                  <AiOutlineFileImage className="mr-2" />
                  Manage Unsplash API Key
                </Button>
              </div>

              {/* Password Form */}
              {showPasswordForm && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 bg-gray-700 p-4 rounded-lg"
                >
                  <div className="mb-6">
                    <Label
                      className="font-bold text-white"
                      htmlFor="password1"
                      value="New Password"
                    />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                      id="password1"
                      type="password"
                      required
                    />
                  </div>
                  <Button
                    isProcessing={processing}
                    processingSpinner={
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                    className="bg-blue-600 text-white font-bold rounded-lg w-full"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              )}

              {/* API Key Forms */}
              {showApiKeyForm && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                  <p className="font-bold text-white mb-2">
                    Current Gemini API Key:
                  </p>
                  <div className="flex items-center mb-4">
                    <input
                      type={showCurrentApiKey ? "text" : "password"}
                      value={currentApiKey}
                      readOnly
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentApiKey(!showCurrentApiKey)}
                      className="ml-2 text-blue-500 underline"
                    >
                      {showCurrentApiKey ? "Hide" : "Show"}
                    </button>
                  </div>
                  <form onSubmit={handleSubmitApiKey}>
                    <Label
                      className="font-bold text-white mb-2"
                      htmlFor="newApiKey"
                      value="New Gemini API Key"
                    />
                    <input
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                      id="newApiKey"
                      type="text"
                      required
                    />
                    <Button
                      isProcessing={processing}
                      processingSpinner={
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                      }
                      className="bg-green-600 text-white font-bold rounded-lg w-full mt-4"
                      type="submit"
                    >
                      Submit New Key
                    </Button>
                  </form>
                </div>
              )}

              {showUnsplashApiKeyForm && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                  <p className="font-bold text-white mb-2">
                    Current Unsplash API Key:
                  </p>
                  <div className="flex items-center mb-4">
                    <input
                      type={showCurrentUnsplashApiKey ? "text" : "password"}
                      value={currentUnsplashApiKey}
                      readOnly
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentUnsplashApiKey(!showCurrentUnsplashApiKey)
                      }
                      className="ml-2 text-blue-500 underline"
                    >
                      {showCurrentUnsplashApiKey ? "Hide" : "Show"}
                    </button>
                  </div>
                  <form onSubmit={()=>{alert('handleUnsplashApiSubmit')}}>
                    <Label
                      className="font-bold text-white mb-2"
                      htmlFor="newUnsplashApiKey"
                      value="New Unsplash API Key"
                    />
                    <input
                      value={newUnsplashApiKey}
                      onChange={(e) => setNewUnsplashApiKey(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                      id="newUnsplashApiKey"
                      type="text"
                      required
                    />
                    <Button
                      isProcessing={processing}
                      processingSpinner={
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                      }
                      className="bg-purple-600 text-white font-bold rounded-lg w-full mt-4"
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
