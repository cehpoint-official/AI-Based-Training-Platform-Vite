// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { Button } from 'flowbite-react';
// import { AiOutlineLoading } from 'react-icons/ai';

// const Quiz = ({ courseTitle, onCompletion }) => {
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [score, setScore] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);

//     useEffect(() => {
//         const fetchQuiz = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch(
//                      'a5ab2faec6e948bab280bc4bf6c50809',
//                     {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                             // 'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`, // Use the API key here
//                         },
//                         body: JSON.stringify({ courseTitle }),
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch quiz');
//                 }

//                 const data = await response.json();
//                 setQuestions(data.quiz); // Adjust this based on the API response structure
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching quiz:', error);
//                 toast.error('Failed to load quiz. Please try again later.');
//                 setLoading(false);
//             }
//         };

//         fetchQuiz();
//     }, [courseTitle]);

//     const handleAnswerSelection = (index) => {
//         setSelectedAnswer(index);
//     };

//     const handleNext = () => {
//         if (selectedAnswer === questions[currentQuestion].answer) {
//             setScore(score + 1);
//             toast.success("Correct!");
//         } else {
//             toast.error("Wrong! Try again.");
//         }

//         setSelectedAnswer(null);
//         if (currentQuestion < questions.length - 1) {
//             setCurrentQuestion(currentQuestion + 1);
//         } else {
//             onCompletion(score + 1);
//         }
//     };

//     return (
//         <div className='flex flex-col items-center'>
//             {loading ? (
//                 <AiOutlineLoading className="animate-spin" />
//             ) : (
//                 <div className='quiz-container'>
//                     <h2>{questions[currentQuestion]?.question}</h2>
//                     <div className='options'>
//                         {questions[currentQuestion]?.options.map((option, index) => (
//                             <button
//                                 key={index}
//                                 className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
//                                 onClick={() => handleAnswerSelection(index)}
//                             >
//                                 {option}
//                             </button>
//                         ))}
//                     </div>
//                     <Button onClick={handleNext} disabled={selectedAnswer === null}>
//                         Next
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Quiz;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';

const Quiz = ({ courseTitle, onCompletion }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    'https://api.aimlapi.com', 
                
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer AIzaSyAnIN9pRtfPR0SUBnLJNk8nQWagrfYCnak`, // Use the provided API key
                        },
                        body: JSON.stringify({ courseTitle }),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch quiz: ${errorText}`);
                }

                const data = await response.json();
                setQuestions(data.quiz); // Adjust based on actual API response
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quiz:', error);
                toast.error('Failed to load quiz. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [courseTitle]);

    const handleAnswerSelection = (index) => {
        setSelectedAnswer(index);
    };

    const handleNext = () => {
        if (selectedAnswer === questions[currentQuestion]?.answer) {
            setScore(prevScore => prevScore + 1);
            toast.success("Correct!");
        } else {
            toast.error("Wrong! Try again.");
        }

        setSelectedAnswer(null);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prevQuestion => prevQuestion + 1);
        } else {
            onCompletion(score + 1);
        }
    };

    return (
        <div className='flex flex-col items-center'>
            {loading ? (
                <AiOutlineLoading className="animate-spin" />
            ) : (
                <div className='quiz-container'>
                    <h2>{questions[currentQuestion]?.question || 'Loading question...'}</h2>
                    <div className='options'>
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelection(index)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleNext} disabled={selectedAnswer === null}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Quiz;