// src/components/ReportModal.jsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ReportModal = ({ isOpen, onClose, report, questionsData, namee, email }) => {
  if (!isOpen) return null;

  const aiAnalysis = report?.aiAnalysis || {};
  const expectations = report?.expectations || {};

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-gray-300 rounded-lg shadow-lg max-w-3xl w-full mx-4 sm:mx-0 overflow-y-auto max-h-[80vh] scrollbar-none">
        {/* Modal Header - Using sticky positioning */}
        <div className="sticky top-0 z-10 bg-gray-700 border-b border-gray-600">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Detailed Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close Report Modal"
            >
              <AiOutlineClose className="h-6 w-6" />
            </button>
          </div>
        </div>
  
        {/* Modal Content */}
        <div className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Basic Information</h3>
            <p><span className="font-semibold">Name:</span> {namee || 'Unknown'}</p>
            <p><span className="font-semibold">Email:</span> {email || 'Unknown'}</p>
          </div>
  
          {/* Performance Summary */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Performance Summary</h3>
            <p><span className="font-semibold">Score:</span> {aiAnalysis.correctAnswers || 0} out of {aiAnalysis.totalQuestions || 0} ({aiAnalysis.scorePercentage || 0}%)</p>
            <p><span className="font-semibold">Employability Score:</span> {aiAnalysis.employabilityScore || 'Not Available'}</p>
            <p><span className="font-semibold">AI Assessment:</span> {aiAnalysis.aiWords || 'Not Available'}</p>
          </div>
  
          {/* Job Expectations */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Job Expectations</h3>
            <p><span className="font-semibold">Salary:</span> {expectations.salary || 'Not specified'}</p>
            <p><span className="font-semibold">Career Growth:</span> {expectations.careerGrowth || 'Not specified'}</p>
            <p><span className="font-semibold">Learning Opportunities:</span> {expectations.learningOpportunities || 'Not specified'}</p>
          </div>
  
          {/* Feedback */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Feedback</h3>
            <p>{report?.feedback || 'No feedback available.'}</p>
          </div>
  
          {/* Additional Notes */}
          {aiAnalysis.additionalNotes && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <p>{aiAnalysis.additionalNotes}</p>
            </div>
          )}
  
          {/* Suggestions */}
          {report?.suggestions && report.suggestions.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Suggestions for Improvement</h3>
              <ul className="list-disc list-inside">
                {report.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
  
          {/* Questions and Answers */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Questions and Answers</h3>
            {questionsData.length === 0 ? (
              <p className="text-center">No questions available to display.</p>
            ) : (
              <div className="space-y-4">
                {questionsData.map((question, index) => (
                  <div key={index} className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">
                      {index + 1}. {question.question || 'No question available'}
                    </h4>
                    <p>
                      <span className="font-semibold">Your Answer:</span>{' '}
                      {question.userAnswer || question.userTextAnswer || 'N/A'}
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
        </div>
  
        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;