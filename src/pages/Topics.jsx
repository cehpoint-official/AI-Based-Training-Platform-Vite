import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footers from "../components/Footers";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const Topics = () => {
  const { state } = useLocation();
  const [processing, setProcessing] = useState(false);
  const { jsonData, mainTopic, type , useUserApiKey, userApiKey } = state || {};

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

  function redirectCourse() {
    const mainTopicData = jsonData[mainTopic][0];

    const firstSubtopic = mainTopicData.subtopics[0];

    if (type === "video & text course") {
      const query = `${firstSubtopic.title} ${mainTopic} in english`;
      sendVideo(query, firstSubtopic.title);
      setProcessing(true);
    } else {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${firstSubtopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
      const promptImage = `Provide a relevant example of "${firstSubtopic.title}" within the context of "${mainTopic}". The example should be clear and concise, directly illustrating the subtopic in relation to the main topic.`;
      setProcessing(true);
      sendPrompt(prompt, promptImage,useUserApiKey, userApiKey);
    }
  }

  async function sendPrompt(prompt, promptImage,useUserApiKey, userApiKey) {
    const dataToSend = {
      prompt: prompt,
      useUserApiKey: useUserApiKey,
      userApiKey: userApiKey,
    };
    try {
      const postURL = "/api/generate";
      const res = await axiosInstance.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;

      try {
        const parsedJson = htmlContent;
        sendImage(parsedJson, promptImage);
      } catch (error) {
        sendPrompt(prompt, promptImage,useUserApiKey, userApiKey);
      }
    } catch (error) {
      sendPrompt(prompt, promptImage,useUserApiKey, userApiKey);
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
    jsonData[mainTopic][0].subtopics[0].theory = theory;
    jsonData[mainTopic][0].subtopics[0].image = image;

    const user = sessionStorage.getItem("uid");
    const content = JSON.stringify(jsonData);
    const postURL = "/api/course";
    const response = await axiosInstance.post(postURL, {
      user,
      content,
      type,
      mainTopic,
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
      sendData(image, theory);
    }
  }

  async function sendDataVideo(image, theory) {
    jsonData[mainTopic][0].subtopics[0].theory = theory;
    jsonData[mainTopic][0].subtopics[0].youtube = image;

    const user = sessionStorage.getItem("uid");
    const content = JSON.stringify(jsonData);
    const postURL = "/api/course";
    const response = await axios.post(postURL, {
      user,
      content,
      type,
      mainTopic,
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
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        sendTranscript(generatedText, subtopic);
      } catch (error) {
        sendVideo(query, subtopic);
      }
    } catch (error) {
      sendVideo(query, subtopic);
    }
  }

  async function sendTranscript(url, subtopic) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = "/api/transcript";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        const allText = generatedText.map((item) => item.text);
        const concatenatedText = allText.join(" ");
        const prompt = `Summarize this theory in a teaching way and :- ${concatenatedText}.`;
        sendSummery(prompt, url);
      } catch (error) {
        const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
        sendSummery(prompt, url);
      }
    } catch (error) {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
      sendSummery(prompt, url);
    }
  }

  async function sendSummery(prompt, url) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = "/api/generate";
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;

      try {
        const parsedJson = htmlContent;
        setProcessing(false);
        sendDataVideo(url, parsedJson);
      } catch (error) {
        sendSummery(prompt, url);
      }
    } catch (error) {
      sendSummery(prompt, url);
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
