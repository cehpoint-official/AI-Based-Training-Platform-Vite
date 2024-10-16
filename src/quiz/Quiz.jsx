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
                console.log('Starting fetch request...'); // Debug: Start of fetch
                const response = await fetch(
                    'https://api.aimlapi.com',  // Update this with the actual Gemini API endpoint
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer AIzaSyAnIN9pRtfPR0SUBnLJNk8nQWagrfYCnak`, // Use your actual API key
                        },
                        body: JSON.stringify({ courseTitle }),
                    }
                );

                // Log response status for debugging
                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response error text:', errorText); // Log error details
                    throw new Error(`Failed to fetch quiz: ${errorText}`);
                }

                // Log the response before parsing it
                console.log('Raw response:', await response.clone().text());

                const data = await response.json();
                
                // Log the parsed JSON data
                console.log('Parsed data:', data);

                setQuestions(data.quiz); // Adjust this based on the actual API response structure
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
