import React, { useState } from 'react';
import { addQuestionToFirebase } from '../firebaseUtils'; // Import Firebase function

const AddQuestion = () => {
  const [question, setQuestion] = useState('');
  const [skills, setSkills] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [choices, setChoices] = useState(['']);
  const [type, setType] = useState('MCQ');

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleRemoveChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      question,
      skills,
      correctAnswer,
      choices: type === 'MCQ' ? choices : [],
      type,
    };

    try {
      await addQuestionToFirebase(newQuestion); // Function to save to Firebase
      alert('Question added successfully');
      // Clear form after submission
      setQuestion('');
      setSkills([]);
      setCorrectAnswer('');
      setChoices(['']);
      setType('MCQ');
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-800 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Question</h2>
      <form onSubmit={handleSubmit}>
        {/* Question Field */}
        <div className="mb-4">
          <label className="block text-md mb-2">Question</label>
          <textarea
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question"
            required
          />
        </div>

        {/* Skills Field */}
        <div className="mb-4">
          <label className="block text-md mb-2">Skills (comma separated)</label>
          <input
            type="text"
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={skills.join(', ')}
            onChange={(e) =>
              setSkills(e.target.value.split(',').map((skill) => skill.trim()))
            }
            placeholder="Enter skills (e.g., JavaScript, React)"
          />
        </div>

        {/* Type Selector */}
        <div className="mb-4">
          <label className="block text-md mb-2">Type</label>
          <select
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="Text">Text-based Answer</option>
          </select>
        </div>

        {/* Choices for MCQ */}
        {type === 'MCQ' && (
          <div className="mb-4">
            <label className="block text-md mb-2">Choices</label>
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-1 p-3 rounded-md bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mr-2"
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...choices];
                    updatedChoices[index] = e.target.value;
                    setChoices(updatedChoices);
                  }}
                  placeholder={`Choice ${index + 1}`}
                />
                {choices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChoice(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChoice}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              + Add Choice
            </button>
          </div>
        )}

        {/* Correct Answer Field */}
        <div className="mb-4">
          <label className="block text-md mb-2">Correct Answer</label>
          <input
            type="text"
            className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-300"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
