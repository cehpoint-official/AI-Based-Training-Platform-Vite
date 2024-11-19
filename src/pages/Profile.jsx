import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footers from "../components/Footers";
import { Button, Label } from "flowbite-react";
import {
  AiOutlineFileImage,
  AiOutlineKey,
  AiOutlineLoading,
  AiOutlineLock,
  AiOutlineYoutube,
} from "react-icons/ai";
import { toast } from "react-toastify";
import axiosInstance from "../axios";
import { getAuth } from "firebase/auth";

const Profile = () => {
  const auth = getAuth();
  const [mName, setName] = useState(sessionStorage.getItem("mName"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [firebase_id, setFirebase_id] = useState(sessionStorage.getItem("uid"));
  const [profileImg, setProfileImg] = useState("https://firebasestorage.googleapis.com/v0/b/ai-based-training-platfo-ca895.appspot.com/o/user.png?alt=media&token=cdde4ad1-26e7-4edb-9f7b-a3172fbada8d");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [currentApiKey, setCurrentApiKey] = useState(sessionStorage.getItem("currentApiKey") || "");
  const [showCurrentApiKey, setShowCurrentApiKey] = useState(false);
  const [showUnsplashApiKeyForm, setShowUnsplashApiKeyForm] = useState(false);
  const [newUnsplashApiKey, setNewUnsplashApiKey] = useState("");
  const [currentUnsplashApiKey, setCurrentUnsplashApiKey] = useState(sessionStorage.getItem("currentUnsplashApiKey") || "");
  const [showCurrentUnsplashApiKey, setShowCurrentUnsplashApiKey] = useState(false);
  const [showYoutubeApiKeyForm, setShowYoutubeApiKeyForm] = useState(false);
  const [newYoutubeApiKey, setNewYoutubeApiKey] = useState("");
  const [currentYoutubeApiKey, setCurrentYoutubeApiKey] = useState(sessionStorage.getItem("currentYoutubeApiKey") || "");
  const [showCurrentYoutubeApiKey, setShowCurrentYoutubeApiKey] = useState(false);

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
    const storedUnsplashApiKey = sessionStorage.getItem("uapiKey");
    if (storedUnsplashApiKey) {
      setCurrentUnsplashApiKey(storedUnsplashApiKey);
    }
    const storedYoutubeApiKey = sessionStorage.getItem("yapiKey");
    if (storedYoutubeApiKey) {
      setCurrentYoutubeApiKey(storedYoutubeApiKey);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/getProfile?uid=${firebase_id}`);
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
    if (!uid) {
      showToast("User ID not found in session");
      setProcessing(false);
      return;
    }
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
        sessionStorage.setItem("apiKey", newApiKey);
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

  const handleSubmitYoutubeApiKey = async (event) => {
    event.preventDefault();
    if (!newYoutubeApiKey) {
      showToast("Please enter the new YouTube API key");
      return;
    }
    setProcessing(true);
    const uid = sessionStorage.getItem("uid");
    const postURL = `/api/profile`;
    try {
      const response = await axiosInstance.post(postURL, {
        email,
        mName,
        youtubeApiKey: newYoutubeApiKey,
        uid,
      });
      if (response.data.success) {
        setCurrentYoutubeApiKey(newYoutubeApiKey);
        sessionStorage.setItem("currentYoutubeApiKey", newYoutubeApiKey);
        showToast(response.data.message);
        setProcessing(false);
        setNewYoutubeApiKey("");
        setShowYoutubeApiKeyForm(false);
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

  const handleChangeYoutubeApiKey = () => {
    setNewYoutubeApiKey("");
    setShowYoutubeApiKeyForm(true);
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

            <div className="bg-gray-800 dark:bg-white/20 p-6 rounded-lg text-white flex items-center justify-center shadow-lg transition-transform transform ">
              <div className="flex items-center justify-start max-md:flex-col max-md:items-center max-md:justify-center">
                <span className="bg-white rounded-lg aspect-square overflow-hidden w-20 shadow-md flex items-center justify-center">
                  <img
                    src={profileImg}
                    alt="Profile Picture"
                    className="w-full object-cover rounded-md"
                  />
                </span>
                <span className="ml-3 flex flex-col justify-center items-center max-md:ml-0">
                  <h1 className="text-2xl font-bold capitalize w-full truncate max-md:text-center">{mName}</h1>
                  <p className="text-sm font-semibold w-full truncate max-md:text-center">{email}</p>
                </span>
              </div>
            </div>

            <div className="space-y-4 mt-8">
                <Button
                  onClick={() => {
                    setShowPasswordForm(true);
                    setShowApiKeyForm(false);
                    setShowUnsplashApiKeyForm(false);
                    setShowYoutubeApiKeyForm(false);
                  }}
                  className="w-full bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <AiOutlineLock className="mr-2" />
                  Change Password
                </Button>
              <Button
                onClick={handleChangeApiKey}
                className="w-full bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
              >
                <AiOutlineKey className="mr-2" />
                Manage Gemini API Key
              </Button>

              <Button
                onClick={handleChangeUnsplashApiKey}
                className="w-full bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
              >
                <AiOutlineFileImage className="mr-2" />
                Manage Unsplash API Key
              </Button>

              <Button
                onClick={handleChangeYoutubeApiKey}
                className="w-full bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
              >
                <AiOutlineYoutube className="mr-2" />
                Manage YouTube API Key
              </Button>
            </div>
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
                    className="bg-red-600 text-white font-bold rounded-lg w-full mt-4"
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
                    onClick={() => setShowCurrentUnsplashApiKey(!showCurrentUnsplashApiKey)}
                    className="ml-2 text-blue-500 underline"
                  >
                    {showCurrentUnsplashApiKey ? "Hide" : "Show"}
                  </button>
                </div>

                <form onSubmit={handleSubmitUnsplashApiKey}>
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
                    className="bg-red-600 text-white font-bold rounded-lg w-full mt-4"
                    type="submit"
                  >
                    Submit New Key
                  </Button>
                </form>
              </div>
            )}

            {showYoutubeApiKeyForm && (
              <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                <p className="font-bold text-white mb-2">
                  Current YouTube API Key:
                </p>
                <div className="flex items-center mb-4">
                  <input
                    type={showCurrentYoutubeApiKey ? "text" : "password"}
                    value={currentYoutubeApiKey}
                    readOnly
                    className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentYoutubeApiKey(!showCurrentYoutubeApiKey)}
                    className="ml-2 text-blue-500 underline"
                  >
                    {showCurrentYoutubeApiKey ? "Hide" : "Show"}
                  </button>
                </div>

                <form onSubmit={handleSubmitYoutubeApiKey}>
                  <Label
                    className="font-bold text-white mb-2"
                    htmlFor="newYoutubeApiKey"
                    value="New YouTube API Key"
                  />
                  <input
                    value={newYoutubeApiKey}
                    onChange={(e) => setNewYoutubeApiKey(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                    id="newYoutubeApiKey"
                    type="text"
                    required
                  />
                  <Button
                    isProcessing={processing}
                    processingSpinner={
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                    className="bg-red-600 text-white font-bold rounded-lg w-full mt-4"
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

      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Profile;
