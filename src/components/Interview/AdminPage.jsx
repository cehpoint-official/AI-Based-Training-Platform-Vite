// src/components/AdminPage.jsx
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig'; // Ensure storage is imported
import { Link, Routes, Route } from 'react-router-dom';
import AddQuestion from './AddQuestion';
import ManageQuestions from './ManageQuestions';
import { FaBars, FaRegFileAlt, FaPlus, FaCog } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import { Button, IconButton, Tooltip as MuiTooltip, CircularProgress, Alert } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';
import AdminDashboard from './AdminDashboard';
import { ref, deleteObject } from "firebase/storage"; // Import ref and deleteObject correctly

const AdminPage = () => {
  const { id } = useParams(); // Extract 'id' from route parameters
  const [testReports, setTestReports] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve' or 'delete'
  const navigate = useNavigate();

  // Fetch test reports from Firebase
  useEffect(() => {
    const fetchTestReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testReport'));
        const reports = [];
        querySnapshot.forEach((doc) => {
          reports.push({ id: doc.id, ...doc.data() });
        });
        setTestReports(reports);
      } catch (error) {
        console.error('Error fetching test reports:', error);
        setError('Failed to fetch test reports.');
      }
    };

    // Fetch resumes from Firebase
    const fetchResumes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'resumes'));
        const resumeData = [];
        querySnapshot.forEach((doc) => {
          resumeData.push({ id: doc.id, ...doc.data() });
        });
        setResumes(resumeData);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setError('Failed to fetch resumes.');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTestReports(), fetchResumes()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to find resume by user ID
  const findResumeByUser = (userId) => {
    return resumes.find((resume) => resume.id === userId);
  };

  // Function to send approval email (mock function)
  const sendApprovalEmail = async (email, name) => {
    try {
      const emailDocs = await getDocs(collection(db, "email"));
      
      // Assuming there's only one document or you're taking the first document
      let subject = '';
      let body = '';
      let phone = '';
      let emailAddress = ''; // Changed variable name for clarity
  
      emailDocs.forEach((doc) => {
        const data = doc.data();
        subject = data.subject; // Access the subject from the Firestore document
        body = data.body;       // Access the body from the Firestore document
        phone = data.phone;     // Access the phone from the Firestore document
        emailAddress = data['email-address']; // Corrected to use bracket notation
      });
  
      if (!subject || !body) {
        throw new Error('Subject or body missing in the email collection');
      }
  
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(`Dear ${name},
${body}\n
        Contact Info:
        Phone No.: ${phone}
        Email Address: ${emailAddress}\n
        We are eager to welcome you aboard and look forward to your contributions at Cehpoint E-learning & Cybersecurity Solutions!\n
        Best regards,   
        Cehpoint E-learning & Cybersecurity Solutions
      `);
  
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;
  
      // Open Gmail compose in a new tab
      window.open(gmailLink, '_blank');
      alert(`Approval email draft opened for ${email}!`);
    } catch (error) {
      console.error("Error sending approval email:", error);
      alert("Failed to open email draft. Please try again.");
    }
  };
  
  
  // Function to delete user records
  const deleteUserRecords = async (userId) => {
    try {
      console.log(`Attempting to delete records for user ID: ${userId}`);

      // Delete test report and resume from Firestore
      const testReportRef = doc(db, 'testReport', userId);
      const resumeRef = doc(db, 'resumes', userId);

      await deleteDoc(testReportRef);
      console.log(`Successfully deleted test report for user ID: ${userId}`);

      await deleteDoc(resumeRef);
      console.log(`Successfully deleted resume for user ID: ${userId}`);

      // Delete screen recording from Firebase Storage
      const screenRecordingRef = ref(storage, `recordings/${userId}screen.webm`);
      await deleteObject(screenRecordingRef);
      console.log(`Successfully deleted screen recording for user ID: ${userId}`);

      // Delete camera recording from Firebase Storage
      const cameraRecordingRef = ref(storage, `recordings/${userId}camera.webm`);
      await deleteObject(cameraRecordingRef);
      console.log(`Successfully deleted camera recording for user ID: ${userId}`);

      // Update state to remove deleted report
      setTestReports((prevReports) => prevReports.filter((report) => report.id !== userId));

      // Alert success
      alert(`User ${userId}'s records, including recordings, have been deleted.`);
    } catch (error) {
      console.error('Error deleting user records and recordings:', error);
      alert('There was an error deleting the user records. Please try again later.');
    }
  };


  // Function to handle download and navigate
  const handleDownloadAndNavigate = (e, report) => {
    e.preventDefault(); // Prevent default link navigation

    if (report.textReport) {
      // Create the .txt file
      const blob = new Blob([report.textReport], { type: 'text/plain' });
      const fileName = `${report.id}_Report.txt`;

      // Download the file using file-saver
      saveAs(blob, fileName);
    } else {
      console.log(`No text content found for this report. ${report.id}`);
      alert('No report data available for download.');
    }
  };

  // Function to handle action confirmations
  const handleAction = (type, report) => {
    setSelectedReport(report);
    setActionType(type);

    if (type === 'approve') {
      setModalTitle('Approve User');
      setModalMessage(`Are you sure you want to approve ${findResumeByUser(report.id)?.name || 'this user'}?`);
    } else if (type === 'delete') {
      setModalTitle('Delete User');
      setModalMessage(`Are you sure you want to delete records for ${findResumeByUser(report.id)?.name || 'this user'}? This action cannot be undone.`);
    }

    setIsModalOpen(true);
  };

  // Function to confirm actions
  const confirmAction = () => {
    if (actionType === 'approve' && selectedReport) {
      const resume = findResumeByUser(selectedReport.id);
      if (resume) {
        sendApprovalEmail(resume.email, resume.name);
      } else {
        alert('Resume not found for this user.');
      }
    } else if (actionType === 'delete' && selectedReport) {
      deleteUserRecords(selectedReport.id);
    }
    setIsModalOpen(false);
  };

  // Function to close confirmation modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setActionType('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gray-800 w-64 p-6 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl mb-8 focus:outline-none"
          aria-label="Close Sidebar"
        >
          <FaBars />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 cursor-pointer" onClick={() => navigate(`/${id}/admin`)}>
          Admin Panel
        </h2>
        <ul>
          <li className="mb-4">
            <Link to="reports" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
              <FaRegFileAlt className="mr-2" />
              View Reports
            </Link>
          </li>
          <li className="mb-4">
            <Link to="add-question" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
              <FaPlus className="mr-2" />
              Add Question
            </Link>
          </li>
          <li className="mb-4">
            <Link to="manage-questions" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
              <FaCog className="mr-2" />
              Manage Questions
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl fixed top-4 left-4 focus:outline-none z-40"
          aria-label="Open Sidebar"
        >
          <FaBars />
        </button>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Routes>
          <Route
            path="reports"
            element={
              <section className="p-8 bg-gray-900 text-white rounded-lg shadow-lg">
                <h3 className="text-3xl font-semibold mb-6 text-center">User Test Reports and Resumes</h3>

                <div className="overflow-x-auto">
  <table className="min-w-full table-fixed bg-gray-800 rounded-lg">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Date</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Email</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Employability Score</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Skill Score</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Resume</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Screen Recording</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 w-1/6">Camera Recording</th>
        <th className="px-4 py-2 text-center text-xs font-medium text-gray-200 w-1/6">Actions</th>
      </tr>
    </thead>
    <tbody>
      {testReports.map((report) => {
        const resume = findResumeByUser(report.id);
        const employabilityScore = report.aiAnalysis?.employabilityScore || 'N/A';
        


        return (
          <tr key={report.id} className="hover:bg-gray-700 transition-colors duration-200">
            <td className="px-4 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{report.createdAt ? new Date(report.createdAt.toDate()).toLocaleString() : 'N/A'}</td>
            <td className="px-4 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{resume?.email || 'N/A'}</td>
            <td className="px-4 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{employabilityScore}</td>
            <td className="px-4 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{(report.analysis.scorePercentage + ' %') || 'N/A'}</td>
            <td className="px-4 py-2 text-sm">
              {resume ? (
                <a
                  href={`https://firebasestorage.googleapis.com/v0/b/my-first-project-903ae.appspot.com/o/resumes%2F${encodeURIComponent(report.id)}.pdf?alt=media`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center hover:text-blue-300"
                >
                  <AiOutlineEye className="mr-1" />
                  View Resume
                </a>
              ) : (
                'No Resume'
              )}
            </td>
            <td className="px-4 py-2 text-sm">
              {report.id ? (
                <a
                  href={`https://firebasestorage.googleapis.com/v0/b/my-first-project-903ae.appspot.com/o/recordings%2F${encodeURIComponent(report.id)}screen.webm?alt=media`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center hover:text-blue-300"
                >
                  <AiOutlineEye className="mr-1" />
                  View Recording
                </a>
              ) : (
                'No Recording'
              )}
            </td>
            <td className="px-4 py-2 text-sm">
              {report.id ? (
                <a
                  href={`https://firebasestorage.googleapis.com/v0/b/my-first-project-903ae.appspot.com/o/recordings%2F${encodeURIComponent(report.id)}camera.webm?alt=media`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center hover:text-blue-300"
                >
                  <AiOutlineEye className="mr-1" />
                  View Recording
                </a>
              ) : (
                'No Recording'
              )}
            </td>
            <td className="px-4 py-2 text-center text-sm">
              <MuiTooltip title="Approve">
                <IconButton
                  color="success"
                  onClick={() => handleAction('approve', report)}
                  aria-label="Approve User"
                  className="text-green-700 hover:text-green-600"
                >
                  <AiOutlineCheckCircle />
                </IconButton>
              </MuiTooltip>
              <MuiTooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleAction('delete', report)}
                  aria-label="Delete User"
                  className="text-red-700 hover:text-red-600"
                >
                  <AiOutlineDelete />
                </IconButton>
              </MuiTooltip>
              <MuiTooltip title="View Detail">
                <IconButton
                  color="primary"
                  onClick={(e) => handleDownloadAndNavigate(e, report)}
                  aria-label="View Detail"
                  className="text-blue-700 hover:text-blue-500"
                >
                  <AiOutlineEye />
                </IconButton>
              </MuiTooltip>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


              </section>
            }
          />
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="manage-questions" element={<ManageQuestions />} />
          <Route path="" element={<AdminDashboard testReports={testReports} resumes={resumes} />} />
        </Routes>

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={isModalOpen}
          title={modalTitle}
          message={modalMessage}
          onConfirm={confirmAction}
          onCancel={closeModal}
        />
      </div>
    </div>
  );
};

export default AdminPage;
