// src/components/Final.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import skillsContext from '../Context/skills';
import { getTestReportsFromFirebase } from '../firebaseUtils';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ReportModal from './ReportModal'; // Import the ReportModal component
import { AiOutlineLoading3Quarters, AiOutlineEye } from 'react-icons/ai';

const Final = () => {
  const { skills } = useContext(skillsContext);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null); // State for report
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchData = async () => {
      if (!skills || !skills.email) {
        console.log('Skills data is missing or incomplete.');
        setLoading(false);
        return;
      }

      try {
        const reportData = await getTestReportsFromFirebase(skills.email);

        if (reportData) {
          setQuestionsData(reportData.questions || []);
          setReport(reportData); // Store report data in state
          console.log('Fetched data:', reportData);
        } else {
          console.log('No such document found for the user.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [skills]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }

  if (!skills || !skills.email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-gray-400 text-xl">
          Skills data is missing or incomplete.
        </p>
      </div>
    );
  }

  const generateTextReport = async () => {
    if (!questionsData || questionsData.length === 0) {
      alert('No report data available to generate the report.');
      return;
    }

    if (!report) {
      console.error('Report data is not defined.');
      alert('Report data is not available.');
      return;
    }

    let feedback = report.feedback || 'No feedback available'; // Safely access feedback
    feedback = feedback.replace('Undefined', report.id); // Ensure report.id is defined
    feedback = feedback.replace('undefined', report.id); // Ensure report.id is defined
    feedback = feedback.replace('[Your Name]', '');
    feedback = feedback.replace('[Your Title]', '');
    feedback = feedback.replace('[Your Company]', '');
    let textContent = `Feedback Report:\n\n${feedback}\n\nQuestions and Answers:\n`;

    questionsData.forEach((question, index) => {
      textContent += `\n${index + 1}. Question: ${
        question.question || 'No question available'
      }\n`;
      textContent += `Your Answer: ${question.type==='text'? (question.userTextAnswer|| 'N/A'):(question.userAnswer || 'N/A')}\n`;
      textContent += `Correct Answer: ${question.correctAnswer || 'N/A'}\n`;
    });

    const updateTestReportInFirebase2 = async (userId, textContent) => {
      try {
        const reportRef = doc(db, 'testReport', userId);

        await updateDoc(reportRef, {
          textReport: textContent,
        });

        console.log('Report updated successfully');
      } catch (error) {
        console.error('Error saving report to Firestore:', error);
        throw error;
      }
    };

    try {
      await updateTestReportInFirebase2(skills.email, textContent);
    } catch (error) {
      console.error('Error saving report to Firestore:', error);
      return;
    }

    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Interview_Report.txt';
    link.click();
  };

  const viewReport = () => {
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('.\assets\image.png')] bg-cover  text-gray-300 p-6 rounded-lg shadow-xl">
      <h1 className="text-4xl mb-4 text-center font-extrabold font-serif text-gray-900 cursor-pointer">🎉🎉🎉 Congratulations! 🎉🎉🎉 </h1>
      <p className="text-lg mb-6 text-center text-gray-500">
        You have successfully completed the interview. Our team will contact you within 1 or 2 working days...
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="contained"
          color="primary"
          onClick={generateTextReport}
          className="transition duration-300 transform hover:scale-105"
        >
          Download Report
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={viewReport}
          className="transition duration-300 transform hover:scale-105 border-gray-800 text-gray-300 hover:border-indigo-500 hover:text-indigo-500"
        >
          View Report
        </Button>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={closeReportModal}
        questionsData={questionsData}
      />
    </div>
  );
};

export default Final;