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
  const auth = getAuth();
  console.log(auth.currentUser);
  const [mName, setName] = useState(sessionStorage.getItem("mName"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [firebase_id, setFirebase_id] = useState(sessionStorage.getItem("uid"));
  console.log(sessionStorage.getItem("uid"));
  const [profileImg, setProfileImg] = useState(
    "https://firebasestorage.googleapis.com/v0/b/ai-based-training-platfo-ca895.appspot.com/o/user.png?alt=media&token=cdde4ad1-26e7-4edb-9f7b-a3172fbada8d"
  );
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
  const [showCurrentUnsplashApiKey, setShowCurrentUnsplashApiKey] = useState(false);

  // YouTube API key states
  const [showYouTubeApiKeyForm, setShowYouTubeApiKeyForm] = useState(false);
  const [newYouTubeApiKey, setNewYouTubeApiKey] = useState("");
  const [currentYouTubeApiKey, setCurrentYouTubeApiKey] = useState(
    sessionStorage.getItem("currentYouTubeApiKey") || ""
  );
  const [showCurrentYouTubeApiKey, setShowCurrentYouTubeApiKey] = useState(false);

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


    const userJsonString = sessionStorage.getItem("user");
    const user = JSON.parse(userJsonString);
    const storedUnsplashApiKey = user.unsplashApiKey;

    if (storedUnsplashApiKey) {
      setCurrentUnsplashApiKey(storedUnsplashApiKey);
    }

    const storedYouTubeApiKey = sessionStorage.getItem("currentYouTubeApiKey");
    if (storedYouTubeApiKey) {
      setCurrentYouTubeApiKey(storedYouTubeApiKey);
    }

  }, []);

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


  const handleSubmitYouTubeApiKey = async (event) => {
    event.preventDefault();
    if (!newYouTubeApiKey) {
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
        youtubeApiKey: newYouTubeApiKey,
        uid,
      });
      if (response.data.success) {
        setCurrentYouTubeApiKey(newYouTubeApiKey);
        sessionStorage.setItem("currentYouTubeApiKey", newYouTubeApiKey);
        showToast(response.data.message);
        setProcessing(false);
        setNewYouTubeApiKey("");
        setShowYouTubeApiKeyForm(false);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      showToast("Internal Server Error");
    }
  };

  const handleChangeYouTubeApiKey = () => {
    setNewYouTubeApiKey("");
    setShowYouTubeApiKeyForm(true);
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
                <span className="ml-4">
                  <p className="text-xl font-bold uppercase">{mName}</p>
                  <p className="text-gray-300">
                    <em>{email}</em>
                  </p>
                </span>
              </div>
              {/* <Button className="bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition duration-200">
                Update
              </Button> */}
            </div>

            <div className="py-6">
              <h2 className="text-center text-2xl font-bold mb-6 text-black dark:text-white">
                Manage Your Account
              </h2>

              <div className="space-y-4">
                <Button
                  onClick={handleChangeYouTubeApiKey}
                  className="w-full bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
                >
                  <AiOutlineKey className="mr-2" />
                  Manage YouTube API Key
                </Button>
              </div>

              {showYouTubeApiKeyForm && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                  <p className="font-bold text-white mb-2">
                    Current YouTube API Key:
                  </p>
                  <div className="flex items-center mb-4">
                    <input
                      type={showCurrentYouTubeApiKey ? "text" : "password"}
                      value={currentYouTubeApiKey}
                      readOnly
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentYouTubeApiKey(!showCurrentYouTubeApiKey)
                      }
                      className="ml-2 text-blue-500 underline"
                    >
                      {showCurrentYouTubeApiKey ? "Hide" : "Show"}
                    </button>
                  </div>

                  <form onSubmit={handleSubmitYouTubeApiKey}>


                  <form onSubmit={handleSubmitUnsplashApiKey}>


                    <Label
                      className="font-bold text-white mb-2"
                      htmlFor="newYouTubeApiKey"
                      value="New YouTube API Key"
                    />
                    <input
                      value={newYouTubeApiKey}
                      onChange={(e) => setNewYouTubeApiKey(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 border border-gray-400 bg-gray-800 text-white rounded-lg block w-full p-2"
                      id="newYouTubeApiKey"
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
                      Save YouTube API Key
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footers />
    </div>
  );
};

export default Profile;
