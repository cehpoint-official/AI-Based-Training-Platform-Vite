import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { getAuth } from "firebase/auth";
import Certificate from "../pages/Certificate";
import { fetchMockQuiz } from "../data/mockQuizData";

const Quiz = ({ courseTitle, onCompletion, courseId, userId }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasFetchedQuiz, setHasFetchedQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answerSaved, setAnswerSaved] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [previousQuizResult, setPreviousQuizResult] = useState(null);

  // ----------------------------------------------------------------------- //
  // Fetch user email and name from Firebase on load
  useEffect(() => {
    if (user) {
      const displayName = user.displayName;
      const emailFromGoogle = user.providerData[0]?.email;

      // Only update if the value has actually changed
      if (displayName !== userName) {
        setUserName(displayName || "User");
      }

      if (emailFromGoogle !== userEmail) {
        setUserEmail(emailFromGoogle || user.email || "");
      }
    } else {
      // If user is not signed in, reset email
      if (userEmail !== "") setUserEmail("");
    }
  }, [user, userName, userEmail]);

  // Function to fetch quiz data manually
  const fetchQuiz = async () => {
    if (hasFetchedQuiz) return; // Prevent refetch if already done

    setLoading(true);
    try {
      // const response = await fetch(
      //   "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-goog-api-key": import.meta.env.VITE_API_KEY, // Use API Key from .env
      //     },
      //     body: JSON.stringify({
      //       contents: [
      //         {
      //           parts: [
      //             {
      //               text: `Generate a quiz for the course: ${courseTitle}. Each question should have:
      //                       - A question text.
      //                       - Four multiple-choice options.
      //                       - The correct answer labeled at the end.

      //                       Format the response as an array of objects, with each object containing:
      //                       - "question": The question text.
      //                       - "options": An array of 4 options.
      //                       - "answer": The correct answer.

      //                       Example format:
      //                       [
      //                           {
      //                               "question": "What is the syntax to define a function in Python?",
      //                               "options": [
      //                                   "def function_name():",
      //                                   "function_name = def:",
      //                                   "def function_name",
      //                                   "define function_name:"
      //                               ],
      //                               "answer": "def function_name():"
      //                           },
      //                           {
      //                               "question": "Which data type is used for decimals in Python?",
      //                               "options": [
      //                                   "int",
      //                                   "float",
      //                                   "complex",
      //                                   "str"
      //                               ],
      //                               "answer": "float"
      //                           }
      //                       ]

      //                       Please generate at least 10 questions in this format.`,
      //             },
      //           ],
      //         },
      //       ],
      //     }),
      //   }
      // );

      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(`Failed to fetch quiz: ${errorText}`);
      // }

      // const rawResponse = await response.text();
      // console.log(rawResponse)
      // const cleanedResponse = cleanResponse(rawResponse);
      // const parsedQuestions = parseQuizContent(cleanedResponse);

      // // --------------------------------------------------------------------------- // //
      // //       Use this for testing -> do not use main api key method                // //
      // // --------------------------------------------------------------------------- // //
      let parsedQuestions;
      const mockData = await fetchMockQuiz("General Knowledge");
      parsedQuestions = mockData.map((item) => ({
        question: item.question,
        options: item.options,
        answer: {
          optionNo:
            item.options.findIndex((option) => option === item.answer) + 1,
          optionAns: item.answer,
        },
      }));
      // // --------------------------------------------------------------------------- // //

      setQuestions(parsedQuestions);
      setHasFetchedQuiz(true); // Mark quiz as fetched
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setLoading(false);
    }
  };

  // Call this function when you want to load the quiz
  const handleStartQuiz = () => {
    fetchQuiz();
    setQuizStarted(true); // Mark quiz as started
  };

  const cleanResponse = (response) => {
    return response.replace(/`/g, ""); // Remove backticks from the response if needed
  };

  const parseQuizContent = (quizText) => {
    try {
      const responseObj = JSON.parse(quizText);
      const quizTextData = responseObj.candidates[0]?.content?.parts[0]?.text;
      const quizDataArr = JSON.parse(quizTextData);

      const formattedQuizData = [];

      quizDataArr.forEach((item) => {
        const answerIndex = item.options.findIndex(
          (option) => option === item.answer
        );
        formattedQuizData.push({
          question: item.question,
          options: item.options,
          answer: {
            optionNo: answerIndex + 1, // Store the option number (1-based index)
            optionAns: item.answer, // Store the actual answer text
          },
        });
      });
      return formattedQuizData;
    } catch (error) {
      console.error("Error parsing quiz content:", error);
      return [];
    }
  };

  const handleAnswerSelection = (index) => {
    setSelectedAnswer(index);
  };

  const handleSaveAnswer = () => {
    // Get the correct answer text for the current question
    const correctAnswer = questions[currentQuestion]?.answer.optionAns;

    // Check if the selected answer is correct or incorrect
    const isCorrect =
      questions[currentQuestion]?.options[selectedAnswer] === correctAnswer;

    // Update score if answer is correct
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswerSaved(true); // Mark answer as saved
  };

  const fetchPreviousQuizResult = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quiz/quiz-results/user/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        // Find the specific quiz result for the current courseId
        const currentCourseResult = data.find(
          (result) => result.courseId === courseId
        );
        setPreviousQuizResult(currentCourseResult);
      }
    } catch (error) {
      console.error("Error fetching previous quiz result:", error);
    }
  };

  useEffect(() => {
    fetchPreviousQuizResult();
  }, []);

  const saveQuizResult = async () => {
    try {
      const quizData = {
        userId: userId, // You already have this from props
        courseId: courseId, // You already have this from props
        score: score, // You already have this in state
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quiz/quiz-results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save quiz result");
      }

      const data = await response.json();
      // console.log('Quiz result saved successfully:', data);
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }
  };

  const handleNext = () => {
    setAnswerSaved(false);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      // Finish the quiz
      setQuizFinished(true);
      saveQuizResult();
      onCompletion(score);
    }
  };

  const getOptionClassName = (index) => {
    if (answerSaved) {
      // Check if the answer is correct or wrong
      const correctAnswer = questions[currentQuestion]?.answer.optionAns;
      if (questions[currentQuestion]?.options[index] === correctAnswer) {
        return "bg-green-500 text-white border-green-600"; // Green for correct answer
      } else if (selectedAnswer === index) {
        return "bg-red-500 text-white border-red-600"; // Red for selected wrong answer
      }
    }
    // Sky blue for selected option
    return selectedAnswer === index
      ? "bg-sky-500 text-white border-sky-600"
      : "bg-gray-50 text-black border-gray-300 hover:bg-gray-100";
  };

  return (
    <>
      {previousQuizResult && previousQuizResult.score >= 5 ? (
        <div className="text-center ">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            You've already passed this quiz!
          </h2>
          <p className="text-xl text-green-500">Your score was: {previousQuizResult.score}</p>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col items-center justify-center text-white h-[80vh] rounded-lg bg-slate-800/80 w-full md:w-[60vw] overflow-y-hidden relative ${
              !quizStarted || !quizFinished ? "p-10" : "px-16"
            }`}
          >
            {/* Floating Score Counter */}
            <div
              className={`absolute top-0 right-0 bg-blue-500 text-white p-4 rounded-lg shadow-lg ${
                quizFinished && "hidden"
              } `}
            >
              <h3 className="text-lg font-semibold">Score: {score}</h3>
            </div>
            {!quizStarted && !quizFinished && (
              <h1 className={`text-3xl font-bold mb-6`}>Quiz</h1>
            )}
            {!quizStarted ? (
              <Button onClick={handleStartQuiz}>Start Quiz</Button>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading size={50} className="animate-spin" />
              </div>
            ) : quizFinished ? (
              score >= 5 ? (
                <Certificate
                  userEmail={userEmail}
                  userName={userName}
                  courseTitle={courseTitle}
                  userId={user.uid}
                />
              ) : (
                <div className="flex items-center justify-center flex-col space-y-4">
                  <h2 className="text-3xl font-bold text-red-500">
                    Sorry, You Didn't Pass
                  </h2>
                  <p className="text-xl">
                    You scored {score} out of 10. We recommend you revise the
                    course and try again.
                  </p>
                </div>
              )
            ) : (
              <div className="w-full max-w-3xl space-y-6 p-4">
                <h2 className="text-xl font-bold">
                  {currentQuestion + 1}. {questions[currentQuestion]?.question}
                </h2>
                <ul className="space-y-3">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <li
                      key={index}
                      className={`border p-2 rounded-lg cursor-pointer transition-colors duration-300 ${getOptionClassName(
                        index
                      )}`}
                      onClick={() => handleAnswerSelection(index)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-4">
                  <Button onClick={handleSaveAnswer} disabled={answerSaved}>
                    {answerSaved ? "Answer Saved" : "Save Answer"}
                  </Button>
                  {answerSaved && (
                    <Button onClick={handleNext}>
                      {currentQuestion === questions.length - 1
                        ? "Finish Quiz"
                        : "Next Question"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Quiz;
