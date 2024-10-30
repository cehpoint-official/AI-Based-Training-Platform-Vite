// src/components/AnalysisPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const AnalysisPage = () => {
  const { state } = useLocation();
  const { answers, questions } = state; // Assuming you pass these in the location state

  return (
    <div className="analysis-page p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Test Analysis</h1>
      <div className="grid grid-cols-1 gap-4">
        {questions.map((question) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer; // Assuming there's a correctAnswer field

          return (
            <div key={question.id} className={`p-4 border rounded ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
              <h3 className="font-semibold">{question.question}</h3>
              <p><strong>Your Answer:</strong> {userAnswer || 'No answer selected'}</p>
              <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
              { !isCorrect && <p className="text-red-600">Feedback: {question.feedback}</p> }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisPage;
