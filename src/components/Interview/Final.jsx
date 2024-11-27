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
import image from "../../assets/image.svg";
import jsPDF from "jspdf";



const Final = () => {
  const { uid } = useParams();
  const { skills } = useContext(skillsContext);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [reportData, setReportData] = useState(null);
  const [testScore,setTestScore] = useState(0); 
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
    const reportData = report;
    if (!questionsData || questionsData.length === 0) {
      alert("No report data available to generate the report.");
      return;
    }
  
    if (!reportData) {
      console.error("Report data is not defined.");
      alert("Report data is not available.");
      return;
    }
  
    // Extract data
    const aiAnalysis = reportData.aiAnalysis || {};
    const expectations = reportData.expectations || {};
    const suggestions = reportData.suggestions || [];
  
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20; // Margin for content
      let cursorY = margin;
  
      // Function to handle page overflow
      const checkPageOverflow = (lineHeight = 10) => {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin; // Reset to top margin for the new page
        }
      };
  
      // Function to wrap and render text
      const renderWrappedText = (text, x, y, maxWidth) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
          checkPageOverflow(10);
          doc.text(line, x, cursorY);
          cursorY += 10;
        });
      };
  
      // Function to draw headers
      const drawSectionHeader = (text) => {
        checkPageOverflow(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor("#283593");
        doc.text(text, margin, cursorY);
        cursorY += 8;
        doc.setDrawColor(204, 204, 204);
        doc.line(margin, cursorY, pageWidth - margin, cursorY); // Underline
        cursorY += 10;
      };
  
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor("#1A237E");
      doc.text("Performance Report", pageWidth / 2, cursorY, { align: "center" });
      cursorY += 30;
  
      // Basic Information
      drawSectionHeader("Basic Information");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
  
      renderWrappedText(
        `Score: ${aiAnalysis.correctAnswers || 0} out of ${aiAnalysis.totalQuestions || 0} questions (${aiAnalysis.scorePercentage || 0}%)`,
        margin,
        cursorY,
        pageWidth - 2 * margin
      );
      renderWrappedText(
        `Employability Score: ${aiAnalysis.employabilityScore || "Not Available"}`,
        margin,
        cursorY,
        pageWidth - 2 * margin
      );
      renderWrappedText(
        `AI Assessment: ${aiAnalysis.aiWords || "Not Available"}`,
        margin,
        cursorY,
        pageWidth - 2 * margin
      );
      cursorY+=15;
      // Performance Feedback
      drawSectionHeader("Performance Feedback");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      renderWrappedText(
        reportData.feedback || "No feedback available.",
        margin,
        cursorY,
        pageWidth - 2 * margin
      );
  
      // Footer
      const timestamp = new Date().toLocaleString();
      checkPageOverflow(10);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${timestamp}`, pageWidth / 2, pageHeight - margin, {
        align: "center",
      });
  
      // Save PDF as Blob
      const pdfBlob = doc.output("blob");
  
      // Upload to Firebase Storage
      const storageRef = ref(storage, `reports/${uid}_${Date.now()}.pdf`);
      const uploadResult = await uploadBytes(storageRef, pdfBlob);
      const fileUrl = await getDownloadURL(uploadResult.ref);
  
      // Update Firebase with PDF URL
      const updatedReportData = {
        pdfReportUrl: fileUrl,
        updatedAt: new Date().toISOString(),
      };
      await updateTestReportInFirebase(uid, updatedReportData);
  
      // Download PDF locally
      doc.save("Performance_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF report:", error);
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
    <div className="flex flex-col border-lime-900 md:flex-row bg-gray-100 items-center justify-center w-screen h-screen text-gray-300 p-4 gap-14">
      {/* Content Section */}
      <div className="max-w-xl space-y-8">
        <h1 className="text-4xl mb-4 text-center font-extrabold font-serif text-gray-900 cursor-pointer">
        🎉  Congratulations! 🎉{" "}
        </h1>
        <p className="text-lg mb-6 text-center text-gray-500">
          You have successfully completed the interview. Our team will contact you
          within 1 or 2 working days
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
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
  
      {/* Image Section */}
      <img
        src={image}
        alt=""
        className="hidden md:block h-auto max-h-[300px] object-contain m-5"
      />
    </div>
  );
  
};


export default Final;
