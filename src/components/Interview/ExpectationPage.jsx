import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  getTestReportsFromFirebase,
  getResumeDataFromFirebase,
  updateTestReportInFirebase,
} from "../../../firebaseUtils";
import { useNavigate, useParams } from "react-router-dom";
import { analyzeReportWithAI } from "./aiModel";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoCrossReference } from "react-icons/go";
import Tooltip from "./Tooltip";
import { collection, query, where, getDocs } from "firebase/firestore";
import debounce from "lodash/debounce";
import Image2 from "../../assets/image2.svg";
import { db } from "../../../firebaseConfig";
import axiosInstance from '../../axios';
import axios from "axios";


const ExpectationPage = () => {
  const { uid } = useParams();
  const [report, setReport] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [expectations, setExpectations] = useState({
    salary: "",
    careerGrowth: "",
    learningOpportunities: "",
  });

  const [tooltipVisible, setTooltipVisible] = useState({
    salary: false,
    careerGrowth: false,
    learningOpportunities: false,
  });

  const [tooltipMessages, setTooltipMessages] = useState({
    salary: "",
    careerGrowth: "",
    learningOpportunities: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const fetchedReport = await getTestReportsFromFirebase(uid);
        setReport(fetchedReport.data);

        const fetchedResumeData = await getResumeDataFromFirebase(uid);
        setResumeData(fetchedResumeData);
      } catch (error) {
        setError("Failed to fetch test report or resume data.");
      } finally {
        setIsFetching(false);
      }
    };

    if (uid) {
      fetchReport();
    }
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpectations((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedReportData = {
        expectations,
        questions: report.reportData.questions,
      };

      await updateTestReportInFirebase(uid, updatedReportData);

      const aiAnalysis = await analyzeReportWithAI(updatedReportData);

      const fullReportData = {
        ...updatedReportData,
        aiAnalysis,
        feedback: aiAnalysis.feedback,
        suggestions: aiAnalysis.suggestions,
      };

      const testScore = (aiAnalysis.correctAnswers/aiAnalysis.totalQuestions)*100 || 0;

      try {
        await axiosInstance.put('/api/update-test-score', {
          uid,
          testScore,
        });
        console.log('Test score updated successfully');
      } catch(err){
          console.error('Error in updating the score : ',err);
      }
        await updateTestReportInFirebase(uid, fullReportData);

      navigate(`/${uid}/final`);
    } catch (error) {
      setError("Failed to submit expectations or generate analysis.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicMessage = useCallback(async (id) => {
    try {
      const q = query(
        collection(db, "expectationInformation"),
        where("id", "==", id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.data().content;
      } else {
        return "No additional information available.";
      }
    } catch (error) {
      return "Error loading information.";
    }
  }, []);

  const toggleTooltip = useCallback(
    async (field) => {
      if (!tooltipMessages[field]) {
        const message = await dynamicMessage(field);
        setTooltipMessages((prev) => ({ ...prev, [field]: message }));
      }
      setTooltipVisible((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [dynamicMessage, tooltipMessages]
  );

  const closeTooltip = useCallback((field) => {
    setTooltipVisible((prev) => ({
      ...prev,
      [field]: false,
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = debounce((event) => {
      const tooltipContainers = document.querySelectorAll(".tooltip-container");
      tooltipContainers.forEach((tooltip) => {
        if (!tooltip.contains(event.target)) {
          const field = tooltip.getAttribute("data-field");
          if (field && tooltipVisible[field]) {
            setTooltipVisible((prev) => ({
              ...prev,
              [field]: false,
            }));
          }
        }
      });
    }, 100);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      handleClickOutside.cancel();
    };
  }, [tooltipVisible]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-gray-400 text-xl">
          No test report available. Please try again later.
        </p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-gray-400 text-xl">
          No resume data available. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch p-6 gap-8 text-gray-300 min-h-screen bg-gray-100">
      {/* Form Section */}
      <form
        className="w-full max-w-2xl mx-12 my-10 rounded-lg bg-white p-6 sm:p-8 md:p-10 lg:p-12 shadow-gray-300 space-y-8 flex-1 h-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Job Expectations
        </h2>
  
        {/* Salary Expectation */}
        <div className="relative group tooltip-container">
          <label className="block text-gray-900 mb-2" htmlFor="salary">
            Salary Expectation
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            placeholder="e.g. 3-4 LPA"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
            value={expectations.salary}
            onChange={handleInputChange}
            required
          />
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => toggleTooltip("salary")}
              className="relative group"
              aria-label="More information about Salary Expectation"
            >
              <GoCrossReference className="h-5 w-5 text-slate-900 cursor-pointer hover:text-indigo-400" />
              {tooltipVisible.salary && tooltipMessages.salary && (
                <Tooltip
                  message={tooltipMessages.salary}
                  onClose={() => closeTooltip("salary")}
                />
              )}
            </button>
          </div>
        </div>
  
        {/* Career Growth */}
        <div className="relative group tooltip-container">
          <label className="block text-gray-900 mb-2" htmlFor="careerGrowth">
            Career Growth
          </label>
          <input
            type="text"
            name="careerGrowth"
            id="careerGrowth"
            placeholder="e.g., Promotions, responsibilities"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
            value={expectations.careerGrowth}
            onChange={handleInputChange}
            required
          />
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => toggleTooltip("careerGrowth")}
              className="relative group"
              aria-label="More information about Career Growth"
            >
              <GoCrossReference className="h-5 w-5 text-slate-900 cursor-pointer hover:text-indigo-400" />
              {tooltipVisible.careerGrowth && tooltipMessages.careerGrowth && (
                <Tooltip
                  message={tooltipMessages.careerGrowth}
                  onClose={() => closeTooltip("careerGrowth")}
                />
              )}
            </button>
          </div>
        </div>
  
        {/* Learning Opportunities */}
        <div className="relative group tooltip-container">
          <label
            className="block text-gray-900 mb-2"
            htmlFor="learningOpportunities"
          >
            Learning Opportunities
          </label>
          <input
            type="text"
            name="learningOpportunities"
            id="learningOpportunities"
            placeholder="e.g., Senior Developer, Corporate Training, AI based training"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
            value={expectations.learningOpportunities}
            onChange={handleInputChange}
            required
          />
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => toggleTooltip("learningOpportunities")}
              className="relative group"
              aria-label="More information about Learning Opportunities"
            >
              <GoCrossReference className="h-5 w-5 text-slate-900 cursor-pointer hover:text-indigo-400" />
              {tooltipVisible.learningOpportunities &&
                tooltipMessages.learningOpportunities && (
                  <Tooltip
                    message={tooltipMessages.learningOpportunities}
                    onClose={() => closeTooltip("learningOpportunities")}
                  />
                )}
            </button>
          </div>
        </div>
  
        <button
          type="submit"
          className="w-full py-3 mt-10 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 inline-block" />
          ) : (
            "Submit Expectations"
          )}
        </button>
      </form>
  
      {/* Image Section */}
      <div className="hidden md:block flex-1 h-[350px] max-h-[500px] mx-auto my-44">
        <img
          src={Image2}
          alt="Background Illustration"
          className="w-full h-full max-h-full object-contain "
        />
      </div>
    </div>
  );
  
};

export default ExpectationPage;
