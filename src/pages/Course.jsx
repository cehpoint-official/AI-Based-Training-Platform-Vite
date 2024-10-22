import { Drawer, Navbar, Sidebar } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import LogoComponent from "../components/LogoComponent";
import { FiMenu, FiX } from "react-icons/fi";
import DarkModeToggle from "../components/DarkModeToggle";
import TruncatedText from "../components/TruncatedText";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import StyledText from "../components/StyledText";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axiosInstance from "../axios";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Quiz from "../quiz/Quiz";

const Course = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setkey] = useState("");
  const { state } = useLocation();
  const { mainTopic, type, courseId, end } = state || {};
  const jsonData = JSON.parse(sessionStorage.getItem("jsonData"));
  const storedTheme = sessionStorage.getItem("darkMode");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [theory, setTheory] = useState("");
  const [media, setMedia] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [isComplete, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [projectSuggestions, setProjectSuggestions] = useState(null);
  const [submissionInstructions, setSubmissionInstructions] = useState(null);
  const [quizAvailable, setQuizAvailable] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleOnClose = () => setIsOpenDrawer(false);

  const CountDoneTopics = () => {
    let doneCount = 0;
    let totalTopics = 0;

    jsonData[mainTopic.toLowerCase()].forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        if (subtopic.done) {
          doneCount++;
        }
        totalTopics++;
      });
    });
    const completionPercentage = Math.round((doneCount / totalTopics) * 100);
    setPercentage(completionPercentage);
    if (completionPercentage >= "100") {
      setIsCompleted(true);
      setQuizAvailable(true);
    }
  };

  const opts = {
    height: "390",
    width: "640",
  };

  const optsMobile = {
    height: "250px",
    width: "100%",
  };

  const finish = async () => {
    if (percentage === 100) {
      try {
        const dataToSend = {
          prompt: `Suggest a mini project based on the topics covered in this course. Include the following details: project description, objectives, and key points.`,
        };
        const postURL = "/api/project-suggestions";
        const res = await axiosInstance.post(postURL, dataToSend);
        setProjectSuggestions(res.data.suggestions);

        setSubmissionInstructions(
          `To submit your project, please push your code to a GitHub repository and share the repository link with us via email at assessment@cehpoint.co.in. Additionally, you can send a short video explaining your project to our submission email. Thank you!`
        );
        const certificateUrl = await getCertificateUrl();

        if (certificateUrl) {
          window.open(certificateUrl, "_blank");
        } else {
          console.error("Certificate URL is not available.");
        }
      } catch (error) {
        console.error("Error fetching project suggestions:", error);
      }
    }
  };
  const getCertificateUrl = async () => {
    try {
      const response = await fetch("/api/get-certificate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "your-user-id" }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      return data.certificateUrl;
    } catch (error) {
      console.error("Error fetching certificate URL:", error);
      return null;
    }
  };

  // async function sendEmail(formattedDate) {
  //   const userName = sessionStorage.getItem("mName");
  //   const email = sessionStorage.getItem("email");
  //   const html = `<!DOCTYPE html>
  //       <html lang="en">
  //       <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="initial-scale=1.0">
  //           <title>Certificate of Completion</title>
  //           <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap">
  //           <style>
  //           body {
  //               font-family: 'Roboto', sans-serif;
  //               text-align: center;
  //               background-color: #fff;
  //               margin: 0;
  //               display: flex;
  //               justify-content: center;
  //               align-items: center;
  //               height: 100vh;
  //           }

  //           .certificate {
  //               border: 10px solid #000;
  //               max-width: 600px;
  //               margin: 20px auto;
  //               padding: 50px;
  //               background-color: #fff;
  //               position: relative;
  //               color: #000;
  //               text-align: center;
  //           }

  //           h1 {
  //               font-weight: 900;
  //               font-size: 24px;
  //               margin-bottom: 10px;
  //           }

  //           h4 {
  //               font-weight: 900;
  //               text-align: center;
  //               font-size: 20px;
  //           }

  //           h2 {
  //               font-weight: 700;
  //               font-size: 18px;
  //               margin-top: 10px;
  //               margin-bottom: 5px;
  //               text-decoration: underline;
  //           }

  //           h3 {
  //               font-weight: 700;
  //               text-decoration: underline;
  //               font-size: 16px;
  //               margin-top: 5px;
  //               margin-bottom: 10px;
  //           }

  //           p {
  //               font-weight: 400;
  //               line-height: 1.5;
  //           }

  //           img {
  //               width: 40px;
  //               height: 40px;
  //               margin-right: 10px;
  //               text-align: center;
  //               align-self: center;
  //           }
  //           </style>
  //       </head>
  //       <body>

  //       <div class="certificate">
  //       <h1>Certificate of Completion 🥇</h1>
  //       <p>This is to certify that</p>
  //       <h2>${userName}</h2>
  //       <p>has successfully completed the course on</p>
  //       <h3>${mainTopic}</h3>
  //       <p>on ${formattedDate}.</p>

  //       <div class="signature">
  //           <img src=${logo}>
  //           <h4>${name}</h4>
  //       </div>
  //   </div>

  //       </body>
  //       </html>`;

  //   try {
  //     const postURL = "/api/sendcertificate";
  //     await axiosInstance
  //       .post(postURL, { html, email })
  //       .then((res) => {
  //         navigate("/certificate", {
  //           state: { courseTitle: mainTopic, end: formattedDate },
  //         });
  //       })
  //       .catch((error) => {
  //         navigate("/certificate", {
  //           state: { courseTitle: mainTopic, end: formattedDate },
  //         });
  //       });
  //   } catch (error) {
  //     navigate("/certificate", {
  //       state: { courseTitle: mainTopic, end: formattedDate },
  //     });
  //   }
  // }

  useEffect(() => {
    loadMessages();
    const CountDoneTopics = () => {
      let doneCount = 0;
      let totalTopics = 0;

      jsonData[mainTopic.toLowerCase()].forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          if (subtopic.done) {
            doneCount++;
          }
          totalTopics++;
        });
      });
      const completionPercentage = Math.round((doneCount / totalTopics) * 100);
      setPercentage(completionPercentage);
      if (completionPercentage >= "100") {
        setIsCompleted(true);
      }
    };

    if (!mainTopic) {
      navigate("/create");
    } else {
      if (percentage >= "100") {
        setIsCompleted(true);
      }

      const mainTopicData = jsonData[mainTopic.toLowerCase()][0];
      const firstSubtopic = mainTopicData.subtopics[0];
      firstSubtopic.done = true;
      setSelected(firstSubtopic.title);
      setTheory(firstSubtopic.theory);

      if (type === "video & text course") {
        setMedia(firstSubtopic.youtube);
      } else {
        setMedia(firstSubtopic.image);
      }
      sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
      CountDoneTopics();
    }
    // eslint-disable-next-line
  }, []);

  const handleSelect = (selectedTopics, selectedSub) => {
    const topicKey = mainTopic.toLowerCase();
    const mTopic = jsonData[topicKey]?.find(
      (topic) => topic.title === selectedTopics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === selectedSub
    );

    if (!mSubTopic) {
      toast.error("Subtopic not found.");
      return;
    }

    const { theory, youtube, image } = mSubTopic;

    if (!theory) {
      const query = `Watch tutorials on ${mSubTopic.title} related to ${mTopic.title} in English. Learn the best practices and insights!`;
      const id = toast.loading("Please wait...");

      if (type === "video & text course") {
        sendVideo(query, selectedTopics, selectedSub, id, mSubTopic.title);
      } else {
        const prompt = `Explain me about this subtopic of ${mTopic.title} with examples: ${mSubTopic.title}. Please strictly don't give additional resources and images.`;
        const promptImage = `Example of ${mSubTopic.title} in ${mTopic.title}`;
        sendPrompt(prompt, promptImage, selectedTopics, selectedSub, id);
      }
      return;
    }

    setSelected(mSubTopic.title);
    setTheory(theory);
    setMedia(type === "video & text course" ? youtube : image);
  };

  async function sendPrompt(prompt, promptImage, topics, sub, id) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = "/api/gemini/generate";
      const res = await axiosInstance.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendImage(parsedJson, promptImage, topics, sub, id);
      } catch (error) {
        sendPrompt(prompt, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendPrompt(prompt, promptImage, topics, sub, id);
    }
  }

  async function sendImage(parsedJson, promptImage, topics, sub, id) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = "/api/image";
      const res = await axiosInstance.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson, topics, sub, id);
      } catch (error) {
        sendImage(parsedJson, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendImage(parsedJson, promptImage, topics, sub, id);
    }
  }

  async function sendData(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.image = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(mSubTopic.youtube);
    } else {
      setMedia(image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function sendDataVideo(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.youtube = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(image);
    } else {
      setMedia(mSubTopic.image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function updateCourse() {
    CountDoneTopics();
    sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
    const content = JSON.stringify(jsonData);

    const chunkSize = 1000000; // 1MB chunks
    const contentChunks = [];

    for (let i = 0; i < content.length; i += chunkSize) {
      contentChunks.push(content.slice(i, i + chunkSize));
    }

    const postURL = "/api/course/update";

    for (let i = 0; i < contentChunks.length; i++) {
      const dataToSend = {
        content: contentChunks[i],
        courseId: courseId,
        chunkIndex: i,
        totalChunks: contentChunks.length,
      };

      try {
        const response = await axiosInstance.post(postURL, dataToSend);

        if (i === contentChunks.length - 1) {
          console.log("Course updated successfully");
          // Handle successful update (e.g., show a success message)
        }
      } catch (error) {
        console.error("Error updating course chunk:", error);
        // Instead of recursive call, you might want to implement a retry mechanism
        // or handle the error more gracefully
        throw error; // This will stop the update process if any chunk fails
      }
    }
  }

  async function sendVideo(query, mTopic, mSubTopic, id, subtop) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = "/api/yt";
      const res = await axiosInstance.post(postURL, dataToSend);

      const generatedText = res.data.url;
      sendTranscript(generatedText, mTopic, mSubTopic, id, subtop);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendTranscript(url, mTopic, mSubTopic, id, subtop) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = "/api/transcript";
      const res = await axiosInstance.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        const allText = generatedText.map((item) => item.text);
        const concatenatedText = allText.join(" ");
        const prompt = `Summarize this theory in a teaching way :- ${concatenatedText}.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      } catch (error) {
        const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.`;
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  async function sendSummery(prompt, url, mTopic, mSubTopic, id) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = "/api/gemini/generate";
      const res = await axiosInstance.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendDataVideo(url, parsedJson, mTopic, mSubTopic, id);
      } catch (error) {
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenClose = (keys) => {
    setIsOpen(!isOpen);
    setkey(keys);
  };

  const defaultMessage = `<p>Hey there! I'm your AI teacher. If you have any questions about your ${mainTopic} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`;
  const defaultPrompt = `I have a doubt about this topic :- ${mainTopic}. Please clarify my doubt in very short :- `;

  const loadMessages = async () => {
    try {
      const jsonValue = sessionStorage.getItem(mainTopic);
      if (jsonValue !== null) {
        setMessages(JSON.parse(jsonValue));
      } else {
        const newMessages = [
          ...messages,
          { text: defaultMessage, sender: "bot" },
        ];
        setMessages(newMessages);
        await storeLocal(newMessages);
      }
    } catch (error) {
      loadMessages();
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = { text: newMessage, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await storeLocal(updatedMessages);
    setNewMessage("");

    let mainPrompt = defaultPrompt + newMessage;
    const dataToSend = { prompt: mainPrompt };
    const url = "/api/gemini/chat";

    console.log("Sending request to:", url);
    console.log("Request data:", dataToSend);

    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await axiosInstance.post(url, dataToSend);

        if (response.data.success === false) {
          console.warn("Request failed, retrying...");
          attempts++;
        } else {
          const botMessage = { text: response.data.text, sender: "bot" };
          const updatedMessagesWithBot = [...updatedMessages, botMessage];
          setMessages(updatedMessagesWithBot);
          await storeLocal(updatedMessagesWithBot);
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Resource not found (404):", error.response.data);
          alert("The resource you are trying to access does not exist.");
          return;
        } else {
          console.error(
            "Error sending message:",
            error.response ? error.response.data : error.message
          );
        }
        attempts++;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    alert(
      "Failed to send the message after several attempts. Please try again later."
    );
  };

  async function storeLocal(messages) {
    try {
      sessionStorage.setItem(mainTopic, JSON.stringify(messages));
    } catch (error) {
      sessionStorage.setItem(mainTopic, JSON.stringify(messages));
    }
  }

  const style = {
    root: {
      base: "h-full",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      inner:
        "no-scrollbar h-full overflow-y-auto overflow-x-hidden rounded-none border-black dark:border-white md:border-r  bg-white py-4 px-3 dark:bg-black",
    },
  };

  const renderTopicsAndSubtopics = (topics) => {
    try {
      return (
        <div>
          {topics.map((topic) => (
            <Sidebar.ItemGroup key={topic.title}>
              <div className="relative inline-block text-left ">
                <button
                  onClick={() => handleOpenClose(topic.title)}
                  type="button"
                  className="inline-flex text-start text-base w-64 font-bold  text-black dark:text-white"
                >
                  {topic.title}
                  <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                </button>

                {isOpen && key === topic.title && (
                  <div className="origin-top-right mt-2 pr-4">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {topic.subtopics.map((subtopic) => (
                        <button
                          key={subtopic.title}
                          onClick={() => {
                            handleSelect(topic.title, subtopic.title);
                            setShowQuiz(false);
                          }}
                          className="flex py-2 text-sm flex-row items-center font-normal text-black dark:text-white  text-start"
                          role="menuitem"
                        >
                          {subtopic.title}
                          {subtopic.done === true ? (
                            <FaCheck className="ml-2" size={12} />
                          ) : (
                            <></>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Sidebar.ItemGroup>
          ))}
          {quizAvailable ||
            (isComplete && (
              <Sidebar.ItemGroup>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="inline-flex text-start text-base w-64 font-bold text-black dark:text-white"
                >
                  Take Quiz
                </button>
              </Sidebar.ItemGroup>
            ))}
        </div>
      );
    } catch (error) {
      return (
        <div>
          {topics.map((topic) => (
            <Sidebar.ItemGroup key={topic.Title}>
              <div className="relative inline-block text-left ">
                <button
                  onClick={() => handleOpenClose(topic.Title)}
                  type="button"
                  className="inline-flex text-start text-base w-64 font-bold  text-black dark:text-white"
                >
                  {topic.Title}
                  <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                </button>

                {isOpen && key === topic.Title && (
                  <div className="origin-top-right mt-2 pr-4">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {topic.Subtopics.map((subtopic) => (
                        <p
                          key={subtopic.Title}
                          onClick={() =>
                            handleSelect(topic.Title, subtopic.Title)
                          }
                          className="flex py-2 flex-row text-sm items-center font-normal text-black dark:text-white  text-start"
                          role="menuitem"
                        >
                          {subtopic.Title}
                          {subtopic.done === true ? (
                            <FaCheck className="ml-2" size={12} />
                          ) : (
                            <></>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Sidebar.ItemGroup>
          ))}
        </div>
      );
    }
  };

  useEffect(() => {
    if (isComplete) {
      const fetchProjectSuggestions = async () => {
        try {
          const response = await fetch("/api/project-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: `Generate project suggestions for ${mainTopic}`,
            }),
          });
          const data = await response.json();
          setProjectSuggestions(data.suggestions);
          setSubmissionInstructions(
            "To submit your project, please create a GitHub repository and share the link with us via email."
          );
        } catch (error) {
          console.error("Error fetching project suggestions:", error);
        }
      };

      fetchProjectSuggestions();
    }
  }, [isComplete, mainTopic]);

  return (
    <>
      {!mainTopic ? null : (
        <div>
          <div
            onClick={() => setIsOpenDrawer(true)}
            className="m-5 fixed bottom-4 right-4 z-40 w-12 h-12 bg-black text-white rounded-full flex justify-center items-center shadow-md dark:text-black dark:bg-white"
          >
            <IoChatbubbleEllipses size={20} />
          </div>
          <div className="flex bg-white dark:bg-black md:hidden pb-10 overflow-y-auto">
            <div
              className={`fixed inset-0 bg-black opacity-50 z-50 ${
                isSidebarOpen ? "block" : "hidden"
              }`}
              onClick={toggleSidebar}
            ></div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div>
                <Navbar
                  fluid
                  className="py-3 dark:bg-black bg-white border-black dark:border-white md:border-b"
                >
                  <Navbar.Brand className="ml-1">
                    {isComplete ? (
                      <button
                        onClick={finish}
                        className="mr-3 underline text-black dark:text-white font-normal cursor-pointer"
                      >
                        {/* Download Certificate */}
                      </button>
                    ) : (
                      <div className="w-7 h-7 mr-3">
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage}%`}
                          styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: "butt",
                            textSize: "20px",
                            pathTransitionDuration: 0.5,
                            pathColor: storedTheme === "true" ? "#fff" : "#000",
                            textColor: storedTheme === "true" ? "#fff" : "#000",
                            trailColor:
                              storedTheme === "true" ? "grey" : "#d6d6d6",
                          })}
                        />
                      </div>
                    )}
                    <TruncatedText text={mainTopic} len={6} />
                  </Navbar.Brand>
                  <div className="flex md:hidden justify-center items-center">
                    <DarkModeToggle className="inline-flex items-center md:hidden" />
                    {isSidebarOpen ? (
                      <FiX
                        onClick={toggleSidebar}
                        className="mx-2"
                        size={20}
                        color={
                          sessionStorage.getItem("darkMode") === "true"
                            ? "white"
                            : "black"
                        }
                      />
                    ) : (
                      <FiMenu
                        onClick={toggleSidebar}
                        className="mx-2"
                        size={20}
                        color={
                          sessionStorage.getItem("darkMode") === "true"
                            ? "white"
                            : "black"
                        }
                      />
                    )}
                  </div>
                  <Navbar.Collapse>
                    <div className="hidden md:flex justify-center items-center mb-2 mt-2">
                      <DarkModeToggle />
                    </div>
                  </Navbar.Collapse>
                </Navbar>
              </div>
              <Sidebar
                aria-label="Default sidebar example"
                theme={storedTheme}
                className={`md:border-r md:border-black md:dark:border-white dark:bg-black fixed inset-y-0 left-0 w-64 bg-white z-50 overflow-y-auto transition-transform transform lg:translate-x-0 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <LogoComponent isDarkMode={storedTheme} />
                <Sidebar.Items className="mt-6">
                  {jsonData &&
                    renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
                </Sidebar.Items>
              </Sidebar>

              <div className="mx-5 overflow-y-auto bg-white dark:bg-black">
                {/* sm & md  */}
                {showQuiz ? (
                  <div className="w-full min-h-[90vh] flex items-center justify-center">
                    <Quiz
                      courseTitle={mainTopic}
                      onCompletion={() => {
                        // Handle quiz completion
                        console.log(`Quiz completed`);
                        // You might want to update some state or show a completion message
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-black text-black dark:text-white text-lg">
                      {selected}
                    </p>
                    <div className="overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full">
                      {type === "video & text course" ? (
                        <div>
                          <YouTube
                            key={media}
                            className="mb-5"
                            videoId={media}
                            opts={{}}
                          />
                          <StyledText text={theory} />
                        </div>
                      ) : (
                        <div>
                          <StyledText text={theory} />
                          <img
                            className="overflow-hidden p-10"
                            src={media}
                            alt="Media"
                          />
                        </div>
                      )}
                    </div>
                    {/* {isComplete && (
                  <div className="mt-10 absolute bg-white w-screen h-20 z-50">
                    <h2 className="text-xl font-bold text-black dark:text-white">
                      Course Quiz
                    </h2>
                    <Quiz
                      // courseTitle={mainTopic}
                      // onCompletion={(score) => {
                      //   // Handle quiz completion
                      //   console.log(`Quiz completed with score: ${score}`);
                      //   // You might want to update some state or show a completion message
                      // }}
                    />
                  </div>
                 // )} */}

                    {isComplete && projectSuggestions && (
                      <div className="mt-10">
                        <h2 className="text-xl font-bold text-black dark:text-white">
                          Project Suggestions
                        </h2>
                        <ul className="list-disc list-inside mt-5 text-black dark:text-white">
                          {projectSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                        <div className="mt-5 text-black dark:text-white">
                          <p>{submissionInstructions}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex bg-black flex-row overflow-y-auto h-screen max-md:hidden">
            <Sidebar theme={storedTheme} aria-label="Default sidebar example">
              <LogoComponent isDarkMode={storedTheme} />
              <Sidebar.Items className="mt-6">
                {jsonData &&
                  renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
              </Sidebar.Items>
            </Sidebar>
            <div className="overflow-y-auto flex-grow flex-col">
              <Navbar
                fluid
                className="py-3 dark:bg-black bg-white border-black dark:border-white md:border-b"
              >
                <Navbar.Brand className="ml-1">
                  {isComplete ? (
                    <button
                      onClick={finish}
                      className="mr-3 underline text-black dark:text-white font-normal cursor-pointer"
                    >
                      {/* Download Certificate */}
                    </button>
                  ) : (
                    <div className="w-8 h-8 mr-3">
                      <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        styles={buildStyles({
                          rotation: 0.25,
                          strokeLinecap: "butt",
                          textSize: "20px",
                          pathTransitionDuration: 0.5,
                          pathColor: storedTheme === "true" ? "#fff" : "#000",
                          textColor: storedTheme === "true" ? "#fff" : "#000",
                          trailColor:
                            storedTheme === "true" ? "grey" : "#d6d6d6",
                        })}
                      />
                    </div>
                  )}
                  <TruncatedText text={mainTopic} len={10} />
                </Navbar.Brand>
                <Navbar.Collapse>
                  <div className="hidden md:flex justify-center items-center mb-2 mt-2">
                    <DarkModeToggle />
                  </div>
                </Navbar.Collapse>
              </Navbar>
              <div className="px-8 bg-white dark:bg-black pt-5">
                {showQuiz ? (
                  <div className="w-full min-h-[80vh] bg-black flex items-center justify-center">
                    <Quiz
                      courseTitle={mainTopic}
                      onCompletion={() => {
                        // Handle quiz completion
                        console.log(`Quiz completed`);
                        // You might want to update some state or show a completion message
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-black text-black dark:text-white text-xl">
                      {selected}
                    </p>
                    <div className="overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full">
                      {type === "video & text course" ? (
                        <div>
                          <YouTube
                            key={media}
                            className="mb-5"
                            videoId={media}
                            opts={{}}
                          />
                          <StyledText text={theory} />
                        </div>
                      ) : (
                        <div>
                          <StyledText text={theory} />
                          <img
                            className="overflow-hidden p-10"
                            src={media}
                            alt="Media"
                          />
                        </div>
                      )}
                    </div>
                    {/* {isComplete && projectSuggestions && (
                      <div className="mt-10">
                        <h2 className="text-xl font-bold text-black dark:text-white">
                          Project Suggestions
                        </h2>
                        <ul className="list-disc list-inside mt-5 text-black dark:text-white">
                          {projectSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                        <div className="mt-5 text-black dark:text-white">
                          <p>{submissionInstructions}</p>
                        </div>
                      </div>
                    )} */}
                  </>
                )}
              </div>
            </div>
          </div>
          <Drawer
            open={isOpenDrawer}
            className="z-50 no-scrollbar bg-white dark:bg-black"
            position="right"
            onClose={handleOnClose}
          >
            <div
              style={{ height: "calc(100% - 50px)", overflowY: "auto" }}
              className="no-scrollbar"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignItems:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      borderTopLeftRadius: msg.sender === "user" ? 5 : 0,
                      borderTopRightRadius: msg.sender === "user" ? 0 : 5,
                      overflow: "hidden",
                    }}
                  >
                    {msg.sender === "user" ? (
                      <div
                        style={{
                          backgroundColor:
                            storedTheme === "true" ? "#F9F9F9" : "#282C34",
                          padding: 16,
                          color: storedTheme === "true" ? "#01020A" : "#fff",
                          margin: 4,
                        }}
                        className="text-black dark:text-white text-xs"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor:
                            storedTheme === "true" ? "#01020A" : "#F9F9F9",
                          padding: 16,
                          color: storedTheme === "true" ? "#fff" : "#01020A",
                          margin: 4,
                        }}
                        className="text-black dark:text-white text-xs "
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row mt-4">
              <input
                value={newMessage}
                placeholder="Ask Something..."
                onChange={(e) => setNewMessage(e.target.value)}
                className="h-12 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white"
                type="text"
              />
              <div
                onClick={sendMessage}
                className="h-12 text-black dark:text-white ml-2 content-center"
              >
                <IoSend size={20} />
              </div>
            </div>
          </Drawer>
        </div>
      )}
    </>
  );
};

export default Course;
