import React, { useState } from "react";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const Quiz = ({ courseTitle, onCompletion }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasFetchedQuiz, setHasFetchedQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Track if quiz has started
  const [answerSaved, setAnswerSaved] = useState(false); // Track if answer is saved

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

                            Please generate at least 10 questions in this format.`
                  }
                ]
              }
            ]
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
    const isCorrect = questions[currentQuestion]?.options[selectedAnswer] === correctAnswer;

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
      // Optionally, handle quiz completion
      onCompletion(score); // Pass the final score
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
    <div className="flex flex-col items-center text-white h-screen overflow-y-hidden">
      {!quizStarted && !hasFetchedQuiz && (
        <Button onClick={handleStartQuiz}>Start Quiz</Button>
      )}

      {quizStarted && loading && (
        <AiOutlineLoading className="animate-spin" />
      )}

      {quizStarted && !loading && questions.length > 0 && (
        <div className="quiz-container">
          <h2>{`Question ${currentQuestion + 1}: ${
            questions[currentQuestion]?.question || "Loading question..."
          }`}</h2>
          <div className="flex flex-col space-y-4 mt-6 mb-6">
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-3 font-bold">{index + 1}.</span>
                <button
                  className={`flex-grow text-left p-3 border rounded-md transition-colors duration-300 ${getOptionClassName(index)}`}
                  onClick={() => handleAnswerSelection(index)}
                  disabled={answerSaved} // Disable option button after saving answer
                >
                  {option}
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            {!answerSaved && (
              <Button onClick={handleSaveAnswer} disabled={selectedAnswer === null}>
                Save Answer
              </Button>
            )}

            {answerSaved && (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
