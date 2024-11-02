// src/components/ReportModal.jsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ReportModal = ({ isOpen, onClose, questionsData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-gray-300 rounded-lg shadow-lg max-w-3xl w-full mx-4 sm:mx-0 overflow-y-auto max-h-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Detailed Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label="Close Report Modal"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {questionsData.length === 0 ? (
            <p className="text-center">No questions available to display.</p>
          ) : (
            <div className="space-y-4">
              {questionsData.map((question, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    {index + 1}. {question.question || 'No question available'}
                  </h3>
                  <p>
                    <span className="font-semibold">Your Answer:</span>{' '}
                    {question.userAnswer || question.userTextAnswer ||'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Correct Answer:</span>{' '}
                    {question.correctAnswer || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;