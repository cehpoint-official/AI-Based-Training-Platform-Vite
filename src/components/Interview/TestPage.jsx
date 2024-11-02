import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { startRecording, stopRecording } from "./recorder";
import { fetchQuestionsBySkills } from "./fetchQuestions";

import {
  AiOutlineLoading3Quarters,
  AiOutlineStop,
  AiOutlinePlayCircle,
} from "react-icons/ai";
import { saveTestReportToFirebase } from "../../../firebaseUtils";
import UserDetailsModal from "./UserDetailsModal";
import skillsContext from "../../Context/skills";
import { Bounce, toast, ToastContainer } from "react-toastify";

const TestPage = () => {
  // const auth = getAuth();
  // const user = auth.currentUser;
  // console.log(user)
  const [userName, setUserName] = useState(sessionStorage.getItem("mName"));
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email"));
  const [userUID, setUserUID] = useState(sessionStorage.getItem("uid"));
  // console.log(sessionStorage.getItem("uid"))
  const [userDetails, setUserDetails] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [textAnswers, setTextAnswers] = useState({});
  const navigate = useNavigate();
  const { skills } = useContext(skillsContext);

  const errorToast = (error) => {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  // Fetch questions based on resume skills
  useEffect(() => {
    const fetchQuestions = async () => {
      // console.log("Starting fetchQuestions with resumeData:", resumeData);
      if (resumeData && resumeData.skills) {
        try {
          const combinedSkills = Array.from(
            new Set([...resumeData.skills, "Corporate"])
          );
          // console.log("Combined skills array:", combinedSkills);

          const fetchedQuestions = await fetchQuestionsBySkills(combinedSkills);
          // console.log("Fetched questions:", fetchedQuestions);

          const initializedQuestions = fetchedQuestions.map((question) => ({
            ...question,
            userAnswer: "",
            userTextAnswer: "",
          }));
          // console.log("Initialized questions:", initializedQuestions);

          setQuestions(initializedQuestions);
        } catch (error) {
          errorToast("Sorry! Questions are not available right now")
        }
      }
      // else {
      //   console.log("No resumeData or skills available:", resumeData);
      // }
    };
    fetchQuestions();
  }, [resumeData]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest(); // Auto-end test when timer reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Start recording when test starts
  useEffect(() => {
    if (testStarted) {
      startRecording();
      setIsRecording(true);
    }
    return () => {
      if (isRecording) {
        stopRecording(userName, userEmail, userUID);
        setIsRecording(false);
      }
    };
  }, [testStarted]);

  const handleSelectAnswer = (choice) => {
    const currentTime = Date.now();
    const questionTime = currentTime - questionStartTime;
    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQuestionIndex]: questionTime,
    }));
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, userAnswer: choice }
          : question
      )
    );
    setQuestionStartTime(currentTime);
  };

  const handleTextAnswerChange = (e) => {
    const answer = e.target.value;
    setTextAnswers({
      ...textAnswers,
      [currentQuestionIndex]: answer,
    });
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, userTextAnswer: answer }
          : question
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    try {
      await stopRecording( userName, userEmail, userUID);
      const savedReport = await saveTestReportToFirebase(
        { questions, timePerQuestion, textAnswers },
        userName || "Unknown",
        userEmail,
        userUID
      );
      // console.log("Saved report:", savedReport);
      navigate(`/${userUID}/expectation`);
    } catch (error) {
      errorToast("Error submitting test")
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
    setIsTimerActive(true);
    setQuestionStartTime(Date.now());
  };

  // Calculate progress percentage
  const progressPercentage = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  return (
    <div className="p-6 bg-[url('.\assets\image3.png')] bg-cover min-h-screen flex flex-col items-center justify-center font-poppins text-gray-100 transition duration-300">
      {/* User Details Modal */}
      {showModal && (
        <UserDetailsModal
          setUserDetails={setUserDetails}
          setResumeData={setResumeData}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Permission Denied Screen */}
      {permissionDenied ? (
        <div className="bg-red-700 text-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">Permission Denied</h2>
          <p className="mb-6">
            Please ensure all required permissions are granted to continue the
            test.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
          >
            Return Home
          </button>
        </div>
      ) : testStarted ? (
        // Test Started Screen
        <div className="bg-gradient-to-br from-gray-50 to-white text-gray-800 rounded-lg shadow-xl p-10 max-w-3xl w-full relative shadow-gray-500">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Timer and Recording Controls */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Time Remaining: {formatTime(timer)}
            </h2>
            <div className="flex items-center space-x-4">
              {isRecording ? (
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition text-lg font-medium"
                  aria-label="Stop Recording and Submit Test"
                >
                  <AiOutlineStop className="w-6 h-6 mr-3" />
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={() => {
                    startRecording();
                    setIsRecording(true);
                  }}
                  className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
                  aria-label="Start Recording"
                >
                  <AiOutlinePlayCircle className="w-6 h-6 mr-3" />
                  Start Recording
                </button>
              )}
            </div>
          </div>

          {/* Question Section */}
          {questions.length > 0 ? (
            <div className="space-y-8">
              <div className="fade-in">
                <h3 className="font-semibold text-2xl mb-6">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="text-xl mb-6 font-medium">
                  {questions[currentQuestionIndex]?.question}
                </p>

                {/* Render based on question type */}
                {questions[currentQuestionIndex]?.type !== "mcq" ? (
                  // Render Textarea for Non-MCQ Questions
                  <div>
                    <label
                      htmlFor="textAnswer"
                      className="block text-lg font-medium text-gray-900 mb-2"
                    >
                      Your Answer:
                    </label>
                    <textarea
                      id="textAnswer"
                      className="w-full p-4 border bg-gray-100 border-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 outline-0"
                      placeholder="Type your answer here..."
                      value={
                        questions[currentQuestionIndex]?.userTextAnswer || ""
                      }
                      onChange={handleTextAnswerChange}
                    />
                  </div>
                ) : (
                  // Render MCQ Options
                  <ul className="space-y-4">
                    {questions[currentQuestionIndex]?.choices?.map(
                      (choice, index) => (
                        <li key={index}>
                          <button
                            className={`w-full flex items-center px-6 py-4 border rounded-lg hover:bg-blue-200 transition  
                            ${
                              questions[currentQuestionIndex]?.userAnswer ===
                              choice
                                ? "bg-blue-200 text-gray-900 border-blue-700"
                                : "bg-white text-gray-900 border-gray-700"
                            } text-lg font-medium`}
                            onClick={() => handleSelectAnswer(choice)}
                          >
                            <span className="mr-4">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {choice}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handleNextQuestion}
                  className={`flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium 
                    ${
                      currentQuestionIndex === questions.length - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  disabled={currentQuestionIndex === questions.length - 1}
                  aria-label="Next Question"
                >
                  Next
                </button>
                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    onClick={handleSubmitTest}
                    className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
                    disabled={isSubmitting}
                    aria-label="Submit Test"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <AiOutlineLoading3Quarters className="w-6 h-6 mr-3 animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Test"
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-xl">No questions available.</p>
          )}
        </div>
      ) : (
        // Pre-Test Instructions Screen
        <div className="relative bg-gradient-to-tr from-slate-50 to-white text-gray-900 rounded-xl shadow-lg p-12 max-w-xl w-full mx-auto overflow-hidden shadow-gray-600">
          {/* Background Animation */}
          <div
            className="absolute inset-0 z-0 opacity-30 pointer-events-none"
            id="vanta-bg"
          ></div>

          {/* Content */}
          <h2 className="text-4xl font-extrabold mb-8 text-center relative z-10">
            Important Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-4 text-lg leading-relaxed relative z-10 ">
            <li>Ensure a stable internet connection throughout the test.</li>
            <li>
              Avoid refreshing the page or closing the browser during the test.
            </li>
            <li>
              Your screen, camera, and microphone will be actively recorded ,
              And capture entire screen throughout the test.
            </li>
            <li>Complete the test within the given time limit.</li>
            <li>Attempt the test fairly and All the Best !</li>
          </ul>
          <div className="mt-10 flex justify-center relative z-10">
            <button
              onClick={handleStartTest}
              className={`border border-gray-600 bg-blue-200 text-gray-900 px-10 py-3 rounded-lg hover:bg-blue-300 hover:text-black transition-colors duration-300 text-lg font-medium
        ${!userDetails || !resumeData ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={!resumeData}
              aria-label="Start Test"
            >
              Start Test
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TestPage;
