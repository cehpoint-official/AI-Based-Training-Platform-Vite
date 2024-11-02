// src/components/ManageQuestions.jsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationForQuestions';
import ToastNotification from './ToastNotification';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newChoices, setNewChoices] = useState(['', '', '', '']);
  const [newType, setNewType] = useState('MCQ'); // Default type is MCQ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  // Search and Filter States
  const [searchSkill, setSearchSkill] = useState('');
  const [filterType, setFilterType] = useState('');

  // Fetch questions from Firebase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const questionData = [];
        querySnapshot.forEach((doc) => {
          questionData.push({ id: doc.id, ...doc.data() });
        });
        setQuestions(questionData);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to fetch questions.');
      }
    };
    fetchQuestions();
  }, []);

  // Handle question deletion
  const handleDelete = async () => {
    if (!deleteQuestionId) return;

    try {
      await deleteDoc(doc(db, 'questions', deleteQuestionId));
      setQuestions(questions.filter((question) => question.id !== deleteQuestionId));
      toast.success('Question deleted successfully.');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question.');
    } finally {
      setIsModalOpen(false);
      setDeleteQuestionId(null);
    }
  };

 // Handle question edit
const handleEdit = async () => {
  if (!editingQuestion) return;

  const updatedChoices = newType === 'MCQ' ? newChoices.filter(choice => choice.trim() !== '') : [];
  console.log(updatedChoices);

  try {
    const questionRef = doc(db, 'questions', editingQuestion);
    await updateDoc(questionRef, {
      question: newQuestion,
      skills: newSkills.split(',').map(skill => skill.trim()),
      correctAnswer: newCorrectAnswer,
      choices: updatedChoices,
      type: newType,
    });
    setQuestions(questions.map((q) => q.id === editingQuestion ? {
      ...q,
      question: newQuestion,
      skills: newSkills.split(',').map(skill => skill.trim()),
      correctAnswer: newCorrectAnswer,
      choices: updatedChoices,
      type: newType,
    } : q));
    toast.success('Question updated successfully.');
    closeEditModal();
  } catch (error) {
    console.error('Error updating question:', error);
    toast.error('Failed to update question.');
  }
};

// Set the fields for editing
const startEditing = (question) => {
  setEditingQuestion(question.id);
  setNewQuestion(question.question);
  setNewSkills(question.skills.join(', '));
  setNewCorrectAnswer(question.correctAnswer);
  setNewChoices(question.choices.length > 0 ? question.choices : ['', '', '', '']);
  setNewType(question.type || 'MCQ');
};

// Close edit modal and reset fields
const closeEditModal = () => {
  setEditingQuestion(null);
  setNewQuestion('');
  setNewSkills('');
  setNewCorrectAnswer('');
  setNewChoices(['', '', '', '']);
  setNewType('MCQ');
};

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteQuestionId(id);
    setIsModalOpen(true);
  };

  // Handle Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  // Apply Search and Filters
  const filteredQuestions = questions.filter((question) => {
    const matchesSkill = searchSkill
      ? question.skills.some(skill => skill.toLowerCase().includes(searchSkill.toLowerCase()))
      : true;
    const matchesType = filterType
      ? question.type.toLowerCase() === filterType.toLowerCase()
      : true;
    return matchesSkill && matchesType;
  });

  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="min-h-screen bg-gray-900 text-white p-8">
      <ToastNotification />
      <h3 className="text-3xl font-semibold mb-6 text-center">Manage Questions</h3>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label htmlFor="skill" className="text-gray-300">Filter by Skill:</label>
          <input
            id="skill"
            type="text"
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter skill"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="type" className="text-gray-300">Filter by Type:</label>
          <select
            id="type"
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All</option>
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="Text">Text</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Skills</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Correct Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {currentQuestions.length > 0 ? (
              currentQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm">{question.question}</td>
                  <td className="px-6 py-4 text-sm">{question.skills.join(', ')}</td>
                  <td className="px-6 py-4 text-sm">{question.correctAnswer}</td>
                  <td className="px-6 py-4 text-sm">{question.type}</td>
                  <td className="px-6 py-4 text-sm flex justify-center space-x-4">
                    <button
                      className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => startEditing(question)}
                      aria-label="Edit Question"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-500 transition-colors duration-200"
                      onClick={() => confirmDelete(question.id)}
                      aria-label="Delete Question"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-indigo-800'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
{editingQuestion && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg relative animate-slide-in max-h-screen overflow-y-auto">
      <button
        className="absolute top-4 right-4 text-white text-2xl hover:text-red-500 focus:outline-none"
        onClick={closeEditModal}
        aria-label="Close Edit Modal"
      >
        &times;
      </button>
      <h4 className="text-2xl font-semibold mb-4">Edit Question</h4>
      <div className="space-y-4">
        
        {/* Question Text */}
        <div>
          <label className="block text-gray-300 mb-2">Question</label>
          <textarea
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
          />
        </div>

        {/* Skills Input */}
        <div>
          <label className="block text-gray-300 mb-2">Skills (comma-separated)</label>
          <input
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            type="text"
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            required
          />
        </div>

        {/* Correct Answer Input */}
        <div>
          <label className="block text-gray-300 mb-2">Correct Answer</label>
          <input
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            type="text"
            value={newCorrectAnswer}
            onChange={(e) => setNewCorrectAnswer(e.target.value)}
            required
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-gray-300 mb-2">Type</label>
          <select
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            required
          >
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="Text">Text</option>
          </select>
        </div>

        {/* Choices for MCQ Type */}
        {newType === 'mcq' && (
          <div>
            <label className="block text-gray-300 mb-2">Choices</label>
            {newChoices.map((choice, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...newChoices];
                    updatedChoices[index] = e.target.value;
                    setNewChoices(updatedChoices);
                  }}
                  placeholder={`Choice ${index + 1}`}
                  required
                />
                <button
                  className="ml-2 text-red-500"
                  onClick={() => {
                    const updatedChoices = newChoices.filter((_, i) => i !== index);
                    setNewChoices(updatedChoices);
                  }}
                  aria-label={`Remove choice ${index + 1}`}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              className="text-blue-500 mt-2"
              onClick={() => setNewChoices([...newChoices, ''])}
            >
              Add Choice
            </button>
          </div>
        )}

        {/* Save Changes Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg transition-colors duration-300"
          onClick={handleEdit}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />
    </section>
  );
};

export default ManageQuestions;
