import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footers from "../components/Footers";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const Topics = () => {
  const location = useLocation();
  const { state } = useLocation();
  const [processing, setProcessing] = useState(false);
  const { jsonData, mainTopic, type , useUserApiKey, apiKey,userunsplashkey, subtopic } = state || {};
  const [showApiKeyErrorPopup, setShowApiKeyErrorPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!jsonData) {
      navigate("/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function redirectCreate() {
    navigate("/create");
  }

  useEffect(() => {
    // Check if the current pathname is "/topics"
    if (location.pathname === "/course") {
      setProcessing(false);
    }
  }, [location.pathname]);

  const showToast = async (msg) => {
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

  const generatePrompt = (firstSubtopicTitle, mainTopic) => {
    // Define the maximum number of words allowed in the prompt
    const maxWords = 10;
  
    // Function to split the string into words and trim if necessary
    const truncateText = (text, maxWords) => {
      const words = text.split(' ');
      return words.slice(0, maxWords).join(' ');
    };
  
    // Combine the titles and check if the word count exceeds the limit
    const combinedTitle = `${firstSubtopicTitle} related to ${mainTopic} in English.`;
    const wordsInPrompt = combinedTitle.split(' ');
  
    // If the word count exceeds the limit, use a truncated version
    if (wordsInPrompt.length > maxWords) {
      return `tutorials on ${truncateText(firstSubtopicTitle, maxWords)} related to ${mainTopic} in English.`;
    } else {
      return combinedTitle;
    }
  };

  function redirectCourse() {
    const mainTopicData = jsonData[mainTopic][0];
    const firstSubtopic = mainTopicData.subtopics[0];
    if (type === "video & text course") {
      const query = generatePrompt(firstSubtopic.title, mainTopic);
      sendVideo(query);
      console.log(query)
      setProcessing(true);
    } else {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${firstSubtopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
      const promptImage = `Example of ${firstSubtopic.title} in ${mainTopic}`;
      setProcessing(true);
      sendPrompt(prompt, promptImage,useUserApiKey, apiKey);
    }
  }

  async function sendPrompt(prompt, promptImage, retryCount = 0, MAX_RETRIES = 3) {

    const dataToSend = {
      prompt: prompt,
      useUserApiKey: useUserApiKey,
      apiKey: apiKey,
    };
  
    try {
      const postURL = "/api/generate";
      const res = await axiosInstance.post(postURL, dataToSend);
      const generatedText = res.data.text;
  
      try {
        const parsedJson = generatedText; 
        sendImage(parsedJson, promptImage); 
      } catch (error) {
        console.error("Error parsing the generated text:", error);
        if (retryCount < MAX_RETRIES) {
          showToast("Error while generating  content, retrying");
          // console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          sendPrompt(prompt, promptImage, retryCount + 1);
        } else {
          showToast("Error while generating  content,Max retries reached");
          console.error("Max retries reached. Failed to parse the response.");
        }
      }
    } catch (error) {
      console.error("Error sending prompt:", error);
      if (retryCount < MAX_RETRIES) {
        // console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        sendPrompt(prompt, promptImage, retryCount + 1);
      } else {
        console.error("Max retries reached. Failed to send the prompt.");
      }
    }
  }
  

  async function sendImage(parsedJson, promptImage) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = "/api/image";
      const res = await axiosInstance.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson);
        setProcessing(false);
      } catch (error) {
        sendImage(parsedJson, promptImage);
      }
    } catch (error) {
      sendImage(parsedJson, promptImage);
    }
  }

  async function sendData(image, theory) {
    try {
      jsonData[mainTopic][0].subtopics[0].theory = theory;
      jsonData[mainTopic][0].subtopics[0].image = image;
  
      const user = sessionStorage.getItem("uid");
      if (!user) {
        showToast("User session not found. Please login again.");
        navigate("/login");
        return;
      }
  
      const content = JSON.stringify(jsonData);
      const postURL = "/api/course";
      
      const requestData = {
        user,
        content,
        type,
        mainTopic,
        useUserApiKey,
        userunsplashkey
      };
  
      // console.log("Sending request with data:", requestData); // Debug log
  
      const response = await axiosInstance.post(postURL, requestData);
  
      if (response.data.success) {
        showToast(response.data.message);
        sessionStorage.setItem("courseId", response.data.courseId);
        sessionStorage.setItem("first", response.data.completed);
        sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
        
        navigate("/course", {
          state: {
            jsonData: jsonData,
            mainTopic: mainTopic.toUpperCase(),
            type: type.toLowerCase(),
            courseId: response.data.courseId,
            end: "",
          },
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error in sendData:", error);
  
      if (error.response) {
        if (error.response.status === 401) {
          // API key error
          setShowApiKeyErrorPopup(true);
        } else if (error.response.status === 500) {
          showToast("Server error. Please try again later.");
          console.error("Server error details:", error.response.data);
        } else {
          showToast(error.response.data.message || "An error occurred");
        }
      } else if (error.request) {
        showToast("Network error. Please check your connection.");
      } else {
        showToast("An unexpected error occurred. Please try again.");
      }
  
      
    }
  }

  

  async function sendDataVideo(image, theory) {
    jsonData[mainTopic][0].subtopics[0].theory = theory;
    jsonData[mainTopic][0].subtopics[0].youtube = image;
    // const subtopic = jsonData[mainTopic][0].subtopics[0].title
    const user = sessionStorage.getItem("uid");
    const content = JSON.stringify(jsonData);
    const postURL = "/api/course";
    const response = await axiosInstance.post(postURL, {
      user,
      content,
      type,
      mainTopic,
      subtopic,
    });

    if (response.data.success) {
      showToast(response.data.message);
      sessionStorage.setItem("courseId", response.data.courseId);
      sessionStorage.setItem("first", response.data.completed);
      sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
      navigate("/course", {
        state: {
          jsonData: jsonData,
          mainTopic: mainTopic.toUpperCase(),
          type: type.toLowerCase(),
          courseId: response.data.courseId,
          end: "",
        },
      });
    } else {
      sendDataVideo(image, theory);
    }
  }

  async function sendVideo(query, subtopic) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = "/api/yt";
      const res = await axiosInstance.post(postURL, dataToSend);

      const generatedText = res.data.url;
      sendTranscript(generatedText, subtopic);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendTranscript(url, subtopic) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = "/api/transcript";
      const res = await axiosInstance.post(postURL, dataToSend);

      const generatedText = res.data.url;
      const allText = generatedText.map((item) => item.text);
      const concatenatedText = allText.join(" ");
      const maxLength = 1000;
      const truncatedText =
        concatenatedText.length > maxLength
          ? concatenatedText.slice(0, maxLength - 3) + "..."
          : concatenatedText;

      // Specify that the summary should be in English
      const prompt = `Summarize this theory in a teaching way in English: ${truncatedText}.`;
      await sendSummery(prompt, url);
    } catch (error) {
      const mainTopicData = jsonData[mainTopic][0];
      const firstSubtopic = mainTopicData.subtopics[0];
      const prompt = `Explain the subtopic of ${mainTopic} in English: ${firstSubtopic.title}.`;
      await sendSummery(prompt, url);
    }
  }

  async function sendSummery(prompt, url) {
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt:", prompt);
      return; // Exit early if the prompt is invalid
    }

    const dataToSend = {
      prompt: prompt,
    };

    try {
      const postURL = "/api/generate";
      const res = await axiosInstance.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;

      const parsedJson = htmlContent; // Ensure this is the expected format
      // setProcessing(false);
      sendDataVideo(url, parsedJson);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  }

  const renderTopicsAndSubtopics = (topics) => {
    try {
      return (
        <div>
          {topics.map((topic) => (
            <div key={topic.title}>
              <h3 className="w-full text-white bg-black px-4 py-2 mt-8 mb-2 font-black text-lg dark:bg-white dark:text-black">
                {topic.title}
              </h3>
              <div>
                {topic.subtopics.map((subtopic) => (
                  <p
                    className="w-full border-black border bg-white px-4 py-2 mb-2 font-normal text-sm dark:text-white dark:border-white dark:bg-black"
                    key={subtopic.title}
                  >
                    {subtopic.title}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return (
        <div>
          {topics.map((topic) => (
            <div key={topic.title}>
              <h3 className="w-full text-white bg-black px-4 py-2 mt-8 mb-2 font-black text-lg dark:bg-white dark:text-black">
                {topic.title}
              </h3>
              <div>
                {topic.subtopics.map((subtopic) => (
                  <p
                    className="w-full border-black border bg-white px-4 py-2 mb-2 font-normal text-sm dark:text-white dark:border-white dark:bg-black"
                    key={subtopic.title}
                  >
                    {subtopic.title}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div>
          <div className="max-md:max-w-sm max-sm:max-w-xs max-w-lg m-auto py-10">
            <h1
              style={{ textTransform: "uppercase" }}
              className="text-4xl text-black font-black text-center dark:text-white"
            >
              {mainTopic}
            </h1>
            <p className="text-center font-bold mt-2 text-base text-black dark:text-white">
              List of topics and subtopics course will cover
            </p>
            {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic])}
            <Button
              onClick={redirectCourse}
              isProcessing={processing}
              processingSpinner={
                <AiOutlineLoading className="h-6 w-6 animate-spin" />
              }
              className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent mt-10 mb-2"
            >
              Generate Course
            </Button>
            <Button
              onClick={redirectCreate}
              type="button"
              className="mb-6 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Topics;