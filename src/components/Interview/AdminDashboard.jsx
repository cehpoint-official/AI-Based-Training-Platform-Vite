import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import { FaBars, FaRegFileAlt, FaPlus, FaCog } from 'react-icons/fa';



const AdminDashboard =({ testReports, resumes }) => {
    const totalReports = testReports.length;
    const totalResumes = resumes.length;
    const pendingApprovals = testReports.length; // Adjust based on your logic
    const activeUsers = resumes.length;
  
    return (
      <section className="p-8 bg-gray-900 shadow-gray-700 text-white rounded-lg shadow-lg mt-10">
        <h3 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Total Test Reports</h4>
            <p className="text-4xl font-bold">{totalReports}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Total Resumes</h4>
            <p className="text-4xl font-bold">{totalResumes}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Pending Approvals</h4>
            <p className="text-4xl font-bold">{pendingApprovals}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Active Users</h4>
            <p className="text-4xl font-bold">{activeUsers}</p>
          </div>
        </div>
  
        <div className="mt-10 flex flex-col md:flex-row justify-around">
          <Link
            to="reports"
            className="bg-blue-600 hover:bg-blue-700 hover:text-gray-100 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 mb-4 md:mb-0"
          >
            <FaRegFileAlt />
            <span>View Reports</span>
          </Link>
          <Link
            to="add-question"
            className="bg-green-600 hover:bg-green-700 hover:text-gray-100 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 mb-4 md:mb-0"
          >
            <FaPlus />
            <span>Add Question</span>
          </Link>
          <Link
            to="manage-questions"
            className="bg-purple-600 hover:bg-purple-700 hover:text-gray-100 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <FaCog />
            <span>Manage Questions</span>
          </Link>
        </div>
      </section>
    );
  };

export default AdminDashboard
