// src/components/Final.jsx

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import skillsContext from "../../Context/skills";
import { getResumeDataFromFirebase, getTestReportsFromFirebase, updateTestReportInFirebase } from "../../../firebaseUtils";
import ReportModal from "./ReportModal"; // Import the ReportModal component
import { AiOutlineLoading3Quarters, AiOutlineEye } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

const Final = () => {
  const { uid } = useParams();
  const { skills } = useContext(skillsContext);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [reportData, setReportData] = useState(null); 
  
  const [personalDataFromResume, setPersonalDataFromResume] = useState(null); 
  const [resumeData, setResumeData] = useState(null); 

  useEffect(() => {
    const fetchAllData = async () => {
      if (!uid) {
        console.log("User ID is missing.");
        setLoading(false);
        return;
      }
  
      try {
        // Fetch both sets of data concurrently
        const [testReportResponse, resumeResponse] = await Promise.all([
          getTestReportsFromFirebase(uid),
          getResumeDataFromFirebase(uid)
        ]);
  
        // Process test report data
        const testData = testReportResponse.data;
        if (testData?.reportData) {
          setQuestionsData(testData.reportData.questions || []);
          setReportData(testData);
          setReport(testData.reportData);
        }
  
        // Process resume data
        const resumeData = resumeResponse.data;
        if (resumeData) {
          setPersonalDataFromResume(resumeData);
          setResumeData(resumeData.resumeData);
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
        // Add user-friendly error handling here

      } finally {
        setLoading(false);
      }
    };

  
    fetchAllData();
  }, [uid]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }


  if (!uid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-gray-400 text-xl">
          User ID is missing or incomplete.

        </p>
      </div>
    );
  }

  const generateTextReport = async () => {
    if (!questionsData || questionsData.length === 0) {

      alert("No report data available to generate the report.");
      return;
    }
  
    if (!report) {
      console.error("Report data is not defined.");
      alert("Report data is not available.");
      return;
    }
  
    let textContent = `Performance Report:\n\n`;
  
    // Basic Info
    textContent += `Name: ${reportData.name || "Unknown"}\n`;
    textContent += `Email: ${reportData.email || "Unknown"}\n\n`;
  
    // Performance Summary
    const aiAnalysis = report.aiAnalysis || {};
    textContent += `Score: ${aiAnalysis.correctAnswers || 0} out of ${
      aiAnalysis.totalQuestions || 0
    } questions (${aiAnalysis.scorePercentage || 0}%)\n`;
    textContent += `Employability Score: ${
      aiAnalysis.employabilityScore || "Not Available"
    }\n`;
    textContent += `AI Assessment: ${aiAnalysis.aiWords || "Not Available"}\n\n`;
  
    // Job Expectations
    const expectations = report.expectations || {};
    textContent += `Job Expectations:\n`;
    textContent += `- Salary: ${expectations.salary || "Not specified"}\n`;
    textContent += `- Career Growth: ${expectations.careerGrowth || "Not specified"}\n`;
    textContent += `- Learning Opportunities: ${
      expectations.learningOpportunities || "Not specified"
    }\n\n`;
  
    // Performance Feedback
    textContent += `Performance Feedback:\n`;
    textContent += `${report.feedback || "No feedback available."}\n\n`;
  
    // Additional Notes
    if (aiAnalysis.additionalNotes) {
      textContent += `Additional Notes:\n${aiAnalysis.additionalNotes}\n\n`;
    }
  
    // Suggestions
    if (report.suggestions && report.suggestions.length > 0) {
      textContent += `Suggestions for Improvement:\n`;
      report.suggestions.forEach((suggestion, index) => {
        textContent += `${index + 1}. ${suggestion}\n`;
      });
      textContent += "\n";
    }
  
    // Questions and Answers
    textContent += `Questions and Answers:\n`;
    questionsData.forEach((question, index) => {
      textContent += `\n${index + 1}. Question: ${
        question.question || "No question available"
      }\n`;
      textContent += `   Your Answer: ${
        question.type === "text"
          ? question.userTextAnswer || "N/A"
          : question.userAnswer || "N/A"
      }\n`;
      textContent += `   Correct Answer: ${question.correctAnswer || "N/A"}\n`;
    });
  
    try {
      // 1. First, upload the text file to Firebase Storage
      const blob = new Blob([textContent], { type: "text/plain" });
      const storageRef = ref(storage, `reports/${uid}_${Date.now()}.txt`);
      const uploadResult = await uploadBytes(storageRef, blob);
      const fileUrl = await getDownloadURL(uploadResult.ref);
  
      // 2. Then, update MongoDB with the file URL and report data
      const updatedReportData = {
        textReportUrl: fileUrl,
        updatedAt: new Date().toISOString(),
        // Include any other report data you want to update
      };
  
      // Update MongoDB through your API
      await updateTestReportInFirebase(uid, updatedReportData);
  
      // 3. Trigger download for user
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Interview_Report.txt";
      link.click();
  
      // console.log('Report uploaded to Storage and database updated successfully');
    } catch (error) {
      console.error("Error in report generation process:", error);
      alert(`Failed to generate report: ${error.message}`);
    }

  };

  const viewReport = () => {
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setIsModalOpen(false);
  };

  return (

    <div className={`flex flex-col items-center justify-center min-h-screen bg-[url('@/assets/image.png')] bg-cover  text-gray-300 p-6 rounded-lg shadow-xl`}>
      <h1 className="text-4xl mb-4 text-center font-extrabold font-serif text-gray-900 cursor-pointer">
        🎉🎉🎉 Congratulations! 🎉🎉🎉{" "}
      </h1>
      <p className="text-lg mb-6 text-center text-gray-500">
        You have successfully completed the interview. Our team will contact you
        within 1 or 2 working days...

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

        report={report}
        questionsData={questionsData}
        namee={reportData.name || "Unknown"}
        email={reportData.email}
        resEmail={personalDataFromResume.email || "Unknown"}
        resName={personalDataFromResume.name || "Unknown"}
        resumeData={resumeData || []}

      />
    </div>
  );
};


export default Final;
