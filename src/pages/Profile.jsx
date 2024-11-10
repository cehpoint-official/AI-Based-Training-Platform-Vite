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
  const [showUnsplashApiKeyForm, setShowUnsplashApiKeyForm] = useState(false);
  const [showYoutubeApiKeyForm, setShowYoutubeApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [newUnsplashApiKey, setNewUnsplashApiKey] = useState("");
  const [newYoutubeApiKey, setNewYoutubeApiKey] = useState("");
  const [currentApiKey, setCurrentApiKey] = useState(sessionStorage.getItem("currentApiKey") || "");
  const [currentUnsplashApiKey, setCurrentUnsplashApiKey] = useState(sessionStorage.getItem("currentUnsplashApiKey") || "");
  const [currentYoutubeApiKey, setCurrentYoutubeApiKey] = useState(sessionStorage.getItem("currentYoutubeApiKey") || "");
  const [showCurrentApiKey, setShowCurrentApiKey] = useState(false);
  const [showCurrentUnsplashApiKey, setShowCurrentUnsplashApiKey] = useState(false);
  const [showCurrentYoutubeApiKey, setShowCurrentYoutubeApiKey] = useState(false);

  const showToast = (msg) => {
    setProcessing(false);
    toast(msg, { position: "bottom-center", autoClose: 3000 });
  };

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("apiKey");
    if (storedApiKey) setCurrentApiKey(storedApiKey);
    const storedUnsplashApiKey = sessionStorage.getItem("uapiKey");
    if (storedUnsplashApiKey) setCurrentUnsplashApiKey(storedUnsplashApiKey);
    const storedYoutubeApiKey = sessionStorage.getItem("yapiKey");
    if (storedYoutubeApiKey) setCurrentYoutubeApiKey(storedYoutubeApiKey);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/getProfile?uid=${firebase_id}`);
      if (response.data.success) setProfileImg(response.data.userProfile.profile);
      else console.error("Failed to fetch profile:", response.data.message);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (firebase_id) fetchProfile();
  }, [firebase_id]);

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
            <h1 className="text-center font-black text-4xl text-black dark:text-white mb-12">Profile</h1>

            {/* ... Profile Image and Update Button */}

            <div className="space-y-4">
              {/* Other buttons */}
              <Button
                onClick={handleChangeYoutubeApiKey}
                className="w-full bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
              >
                <AiOutlineYoutube className="mr-2" />
                Manage YouTube API Key
              </Button>
            </div>

            {/* YouTube API Key Form */}
            {showYoutubeApiKeyForm && (
              <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                <p className="font-bold text-white mb-2">Current YouTube API Key:</p>
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
                    processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
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
