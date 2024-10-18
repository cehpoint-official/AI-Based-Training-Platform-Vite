import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { getAuth } from "firebase/auth";

const Quiz = ({ courseTitle, onCompletion }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  // ----------------------------------------------------------------------- //
  // Fetch user email and name from Firebase on load
  useEffect(() => {
    if (user) {
      const displayName = user.displayName;
      setUserName(displayName || "User"); // Set default name if none exists
      const emailFromGoogle = user.providerData[0]?.email;

      // Check if email is available (either from Google or email/password login)
      if (emailFromGoogle) {
        setUserEmail(emailFromGoogle); // Google email
      } else if (user.email) {
        setUserEmail(user.email); // Email from email/password sign-in
      } else {
        setUserEmail(""); // No email found, reset state
      }
    } else {
      setUserEmail(""); // If user is not signed in, reset email
    }
  }, [user]);

  // ----------------------------------------------------------------------- //
  // Email Sending Logic
  const sendEmail = () => {
    if (!userEmail) {
      setEmailStatus("Email not available");
      console.log("No user email found");
      return;
    }

    setIsLoading(true); // Show loading state
    setEmailStatus(""); // Reset email status before sending

    const emailData = {
      userName: userName, // Name of the user
      userEmail: userEmail, // The email where the message will be sent
      message: "Great Job, You finished the course!", // The email message
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          setEmailStatus("SUCCESS! Email sent");
          alert("SUCCESS! Email sent"); // Show success message
          setIsLoading(false); // Reset loading state
        },
        (error) => {
          setEmailStatus(`FAILED... ${error.text}`);
          console.log("FAILED...", error.text);
          setIsLoading(false); // Reset loading state on error
        }
      );
  };

  // ----------------------------------------------------------------------- //
  // Button Handler
  const handleSendEmail = () => {
    sendEmail();
  };

  // Function to fetch quiz data manually
  const fetchQuiz = async () => {
    if (hasFetchedQuiz) return; // Prevent refetch if already done

    setLoading(true);
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": import.meta.env.VITE_API_KEY, // Use API Key from .env
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate a quiz for the course: ${courseTitle}. Each question should have:
                            - A question text.
                            - Four multiple-choice options.
                            - The correct answer labeled at the end.
                            

                            Format the response as an array of objects, with each object containing:
                            - "question": The question text.
                            - "options": An array of 4 options.
                            - "answer": The correct answer.

                            Example format:
                            [
                                {
                                    "question": "What is the syntax to define a function in Python?",
                                    "options": [
                                        "def function_name():",
                                        "function_name = def:",
                                        "def function_name",
                                        "define function_name:"
                                    ],
                                    "answer": "def function_name():"
                                },
                                {
                                    "question": "Which data type is used for decimals in Python?",
                                    "options": [
                                        "int",
                                        "float",
                                        "complex",
                                        "str"
                                    ],
                                    "answer": "float"
                                }
                            ]

                            Please generate at least 10 questions in this format.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch quiz: ${errorText}`);
      }

      const rawResponse = await response.text();
      const cleanedResponse = cleanResponse(rawResponse);
      const parsedQuestions = parseQuizContent(cleanedResponse);
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

  const handleNext = () => {
    setAnswerSaved(false); // Reset the saved answer flag
    setSelectedAnswer(null); // Clear selection

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      // Finish the quiz
      setQuizFinished(true); // Mark the quiz as finished

      // Send email if score is 5 or more
      if (score >= 5) {
        handleSendEmail(); // Send the email if the user scored 5 or more
      }

      onCompletion(score); // Optionally, pass the final score
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
    <div className="flex flex-col items-center justify-center text-white h-[60vh] rounded-lg bg-slate-800/80 w-full md:w-[60vw] overflow-y-hidden relative p-10">
      {/* Floating Score Counter */}
      <div className={`absolute top-0 right-0 bg-blue-500 text-white p-4 rounded-lg shadow-lg ${quizFinished && 'hidden'} `}>
        <h3 className="text-lg font-semibold">Score: {score}</h3>
      </div>
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      {!quizStarted ? (
        <Button onClick={handleStartQuiz}>Start Quiz</Button>
      ) : loading ? (
        <div className="flex items-center justify-center">
          <AiOutlineLoading size={50} className="animate-spin" />
        </div>
      ) : quizFinished ? (
        score >= 5 ? (
          <div className="flex items-center justify-center flex-col space-y-4">
            <h2 className="text-3xl font-bold text-green-500">
              Congratulations!
            </h2>
            <p className="text-xl">You have successfully completed the quiz.</p>
            <p className="text-lg">
              A certificate has been sent to your email:{" "}
              <span className="font-semibold">{userEmail}</span>.
            </p>
            {emailStatus && <p>{emailStatus}</p>}
            {/* <Button onClick={handleSendEmail}>Resend Certificate</Button> */}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col space-y-4">
            <h2 className="text-3xl font-bold text-red-500">
              Sorry, You Didn't Pass
            </h2>
            <p className="text-xl">
              You scored {score} out of 10. We recommend you revise the course and try again.
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
  );
};

export default Quiz;
