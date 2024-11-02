import React from 'react';

const Question = ({ questionData, onAnswerSelect, selectedAnswer }) => {
  return (
    <div className="bg-black p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{questionData.question}</h2>
      <ul className="list-none">
        {questionData.options.map((option, index) => (
          <li key={index} className="mb-2 flex items-center">
            <button 
              className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 text-center text-ellipsis rounded mr-2 w-10`}
            >
              {index + 1}. {/* Number button */}
            </button>
            <button 
              className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 text-ellipsis rounded w-96 text-left
                         ${selectedAnswer === option ? 'bg-blue-500 text-white' : ''}`} // Highlight selected answer
              onClick={() => onAnswerSelect(option)}
            >
              {option} {/* Option button */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
