// src/components/ResumeUpload.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import skillsContext from "../../Context/skills";
import { uploadResumeData, uploadResumeFile } from "../../../firebaseUtils";
import * as pdfjsLib from "pdfjs-dist/webpack";
import skillsList from "./skills";

import { storage } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axiosInstance from "../../axios";


pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeUpload = ({ onUploadComplete }) => {

  const [userName, setUserName] = useState(sessionStorage.getItem("mName"));
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email"));
  const [userUID, setUserUID] = useState(sessionStorage.getItem("uid"));

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const { setSkills, skills } = useContext(skillsContext); // Access both setSkills and current skills
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [meetsCriteria, setMeetsCriteria] = useState(null);
  const [showEligibilityPopup, setShowEligibilityPopup] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  // ----- Eligiblitity:START -------- //
  const fetchPerformance = async () => {
    try {
      const response = await axiosInstance.get(`/api/top-candidates-admin`);
      const filteredData = response.data.data.filter(
        (item) => item.uid === userUID
      );

      if (filteredData.length > 0) {
        const performanceData = filteredData[0];

        const criteriaMet =
          performanceData.projectCount >= projectCountCriteria &&
          performanceData.courseCount >= courseCountCriteria &&
          performanceData.quizScoreAvg >= quizScoreAvgCriteria &&
          performanceData.averageProgress >= averageProgressCriteria;

        setMeetsCriteria(criteriaMet);

        // Show eligibility popup if criteria not met
        if (!criteriaMet) {
          setShowEligibilityPopup(true);
        }

        console.log(criteriaMet);
      } else {
        setMeetsCriteria(false);
        console.log(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (userUID) {
      fetchPerformance();
      // console.log(performance.data[0])
    } else {
      console.error("User ID not found in session storage.");
      setLoading(false);
    }
  }, [userUID]);

  const projectCountCriteria = 1;
  const courseCountCriteria = 5;
  const quizScoreAvgCriteria = 25;
  const averageProgressCriteria = 100;

  const EligibilityPopup = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-white text-black max-w-md p-5 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-red-600 text-xl">
            Eligibility Check
          </h2>
          <p className="mt-2 text-center">
            You are not eligible for the test. Please go back to home and check
            your performance first.
          </p>
          <div className="w-full flex items-center justify-center gap-x-6 mt-5">
            <a
              href={`${import.meta.env.VITE_ORIGINAL_SITE}/home`}
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-gray-100 transition duration-200"
            >
              Go to Home
            </a>
            <a
              href={`${import.meta.env.VITE_ORIGINAL_SITE}/performance`}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
            >
              Performance
            </a>
          </div>
        </div>
      </div>
    );
  };

   // ----- Eligiblitity:END -------- //

  const navigate = useNavigate();

  // --------------- Check User Exist or not: START --------- //
  useEffect(() => {
    const checkUserExists = async () => {
      try {
        const userCheckResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/testusers/check/${userUID}`, // Check if user exists
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!userCheckResponse.ok) {
          // Handle the case where the user does not exist
          const errorData = await userCheckResponse.json();
          if (errorData.message === "User  not found") {
            setUserExists(false);
          } else {
            setError("Error checking user existence");
          }
        } else {
          // User exists
          const data = await userCheckResponse.json();
          if (data.success) {
            setUserExists(true);
          }
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        setError("Failed to check user existence");
      }
    };

    // Only call the function if userUID is available
    if (userUID) {
      checkUserExists();
    }
  }, [userUID]);
  // --------------- Check User Exist or not: END --------- //

  useEffect(() => {
    if (!userUID) {
      navigate("/signin");
    }
    // console.log(userEmail)
  }, [userUID, navigate]);


  // Load draft from localStorage on component mount
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("resumeDraft"));
    if (draft && draft.selectedFile && draft.skills) {
      setSelectedFile(draft.selectedFile);
      setSkills((prevSkills) => ({
        ...prevSkills,
        skills: draft.skills,
      }));
    }
  }, [setSkills]);

  // Save draft to localStorage whenever selectedFile or extractedData changes
  useEffect(() => {
    const draft = {
      selectedFile,
      skills: skills.skills, // Use existing skills if no extractedData
    };
    localStorage.setItem("resumeDraft", JSON.stringify(draft));
  }, [selectedFile, extractedData, skills.skills]);

  const handleFileChange = (e) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
      setSelectedFile(null);
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile || !(selectedFile instanceof File)) {
      setError("Please select a valid resume file to upload.");
      return;
    }


    setIsParsing(true);
    setError(null);

    try {
      // console.log("Starting resume upload process...");

      // 1. Parse PDF and extract text - Add timeout and error handling
      const arrayBuffer = await selectedFile.arrayBuffer();
      // console.log("File loaded into buffer");

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      // console.log(loadingTask)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PDF loading timeout")), 100000)
      );

      const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
      // console.log("PDF document loaded");

      let extractedText = "";
      const textExtractionPromises = [];



      // Process pages in parallel
      for (let i = 1; i <= pdf.numPages; i++) {
        textExtractionPromises.push(
          pdf.getPage(i).then(async (page) => {
            const textContent = await page.getTextContent();

            return textContent.items.map((item) => item.str).join(" ");
          })
        );
      }

      const pageTexts = await Promise.all(textExtractionPromises);
      extractedText = pageTexts.join("\n");
      // console.log("Text extraction completed");

      if (!extractedText.trim()) {
        throw new Error("No text could be extracted from the PDF");
      }

      // 2. Parse the extracted text
      const parsedData = parseResumeText(extractedText);
      if (!parsedData.skills.includes("Corporate")) {
        parsedData.skills.push("Corporate");
      }
      // console.log("Resume parsed successfully:", parsedData);

      // 3. Update skills context
      setSkills((prevSkills) => ({

        ...prevSkills,
        skills: parsedData.skills,
        name: parsedData.name || prevSkills.name,
        email: parsedData.contact.email || prevSkills.email,
        phone: parsedData.contact.phone || prevSkills.phone,
        experience: parsedData.experience || prevSkills.experience,
        education: parsedData.education || prevSkills.education,
        projects: parsedData.projects || prevSkills.projects,
        certifications: parsedData.certifications || prevSkills.certifications,
      }));


      // 4. Upload to Firebase Storage
      // console.log("Starting file upload to Firebase");
      const fileName = `resumes/${userUID}_${Date.now()}.pdf`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, selectedFile);
      const fileUrl = await getDownloadURL(storageRef);
      // console.log("File uploaded successfully");


      // 5. Prepare metadata for MongoDB
      const metadata = {
        fileName: selectedFile.name,
        fileUrl: fileUrl,

        userId: userUID,
        userEmail: userEmail || parsedData.contact.email || "Unknown",
        userName: userName || parsedData.name || "Unknown",

        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        projects: parsedData.projects,
        certifications: parsedData.certifications,
      };


      // 6. Save metadata to MongoDB
      // console.log("Saving metadata to MongoDB");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/testusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        }
      );


      if (!response.ok) {
        throw new Error(
          `Failed to save metadata to MongoDB: ${response.statusText}`
        );
      }
      // console.log("Saving metadata to MongoDB");

      const responseData = await uploadResumeData(
        parsedData.name || userName || "Unknown",
        parsedData.contact.email || userEmail || "Unknown",
        userUID,
        {
          fileName: metadata.fileName,
          fileUrl: metadata.fileUrl,
          skills: metadata.skills,
          experience: metadata.experience,
          education: metadata.education,
          projects: metadata.projects,
          certifications: metadata.certifications,
        }
      );

      // console.log("Metadata saved successfully:", responseData);


      // 7. Update UI state
      setUploadSuccess(true);
      setIsUploading(false);
      setIsParsing(false);
      onUploadComplete(true, metadata);

    } catch (error) {
      console.error("Upload process failed:", error);
      setError(`Failed to process resume: ${error.message}`);
      setIsParsing(false);
      setIsUploading(false);
      onUploadComplete(false, null);
    } finally {
      // Ensure states are reset even if there's an error
      setIsParsing(false);
      setIsUploading(false);
    }
  };

  // const extractTextFromPDF = async (file, resumeRef) => {
  //   try {
  //     // console.log("Starting text extraction...");
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  //     let extractedText = "";
  //     for (let i = 1; i <= pdf.numPages; i++) {
  //       const page = await pdf.getPage(i);
  //       const textContent = await page.getTextContent();
  //       const pageText = textContent.items.map((item) => item.str).join(" ");
  //       extractedText += pageText + "\n";
  //     }

  //     // console.log("Text extraction completed. Updating Firestore...");

  //     // Update Firestore with extracted text
  //     await updateDoc(resumeRef, {
  //       extractedText: extractedText,
  //       status: "processed",
  //     });

  //     // console.log("Firestore updated with extracted text");

  //     // Optional: Trigger any post-processing here
  //     // For example, skill extraction, parsing, etc.
  //     const parsedData = parseResumeText(extractedText);
  //     await updateDoc(resumeRef, { parsedData });
  //   } catch (error) {
  //     // console.error("Text extraction error:", error);
  //     await updateDoc(resumeRef, { status: "extraction_failed" });
  //   }
  // };

  const parseResumeText = (text) => {
    return {
      name: extractName(text),
      contact: extractContactInfo(text),
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      projects: extractProjects(text),
      certifications: extractCertifications(text),
    };
  };

  const extractName = (text) => {
    const nameMatch = text.match(
      /(?:Name|Personal Details|Contact Info|About Me|Summary)?\s*([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)/i
    );
    return nameMatch && nameMatch[1] ? nameMatch[1].trim() : "Name not found";
  };

  const extractContactInfo = (text) => {
    const email = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    const phone = text.match(
      /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/
    );
    return {
      email: email ? email[0] : "No email found",
      phone: phone ? phone[0] : "No phone number found",
    };
  };

  const extractSkills = (text) => {
    const skillsSectionMatch = text.match(
      /(?:skills|technical skills|key skills|core competencies)[\s\S]*?(?=experience|education|projects|certifications|$)/i
    );
    let skills = [];

    if (skillsSectionMatch) {
      const skillsSection = skillsSectionMatch[0];
      const extractedSkills = skillsSection
        .replace(
          /(skills|technical skills|key skills|core competencies):?/i,
          ""
        )
        .split(/[,|•\n]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      skills = Array.from(new Set([...extractedSkills, "Corporate"]));
    } else {
      skills = ["Corporate"]; // Default if no skills section found
    }

    // **Added Functionality**: Scan the entire resume for additional skills
    const additionalSkills = scanEntireResumeForSkills(text);

    // Combine and ensure uniqueness
    const combinedSkills = Array.from(
      new Set([...skills, ...additionalSkills, "Corporate"])
    );

    // Ensure 'Corporate' is at the front
    const finalSkills = combinedSkills.filter(
      (skill) => skill.toLowerCase() !== "corporate"
    );
    finalSkills.unshift("Corporate");

    return finalSkills.length > 0 ? finalSkills : ["Corporate"];
  };

  // **New Function**: Scan the entire resume text for skills from skills.js
  const scanEntireResumeForSkills = (text) => {
    // Convert text to lowercase for case-insensitive matching
    const lowerCaseText = text.toLowerCase();

    // Initialize an array to hold matched skills
    let matchedSkills = [];

    // Iterate through each skill in skillsList and check if it exists in the text
    skillsList.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      // Use word boundaries to ensure exact matches
      const regex = new RegExp(`\\b${escapeRegExp(skillLower)}\\b`, "i");
      if (regex.test(lowerCaseText)) {
        matchedSkills.push(skill);
      }
    });

    return matchedSkills;
  };

  const extractExperience = (text) => {
    const experiencePattern = /experience[\s\S]*?(projects|education)/i;
    const experienceMatch = text.match(experiencePattern);
    if (experienceMatch && experienceMatch[0]) {
      const experienceText = experienceMatch[0]
        .replace(/(projects|education)/i, "")
        .trim();
      const experiences = experienceText
        .split(/[\n•]+/)
        .filter((e) => e.trim());
      return experiences.length ? experiences : ["No experience found"];
    }
    return ["No experience found"];
  };

  const extractEducation = (text) => {
    const educationPattern = /education[\s\S]*?(projects|certifications)/i;
    const educationMatch = text.match(educationPattern);
    if (educationMatch && educationMatch[0]) {
      const educationText = educationMatch[0]
        .replace(/(projects|certifications)/i, "")
        .trim();
      const education = educationText.split(/[\n•]+/).filter((e) => e.trim());
      return education.length ? education : ["No education found"];
    }
    return ["No education found"];
  };

  const extractProjects = (text) => {
    const projectsPattern =
      /projects[\s\S]*?(certifications|co-curricular|achievements|$)/i;
    const projectsMatch = text.match(projectsPattern);
    if (projectsMatch && projectsMatch[0]) {
      const projectsText = projectsMatch[0]
        .replace(/(certifications|co-curricular|achievements)/i, "")
        .trim();
      const projects = projectsText.split(/[\n•]+/).filter((p) => p.trim());
      return projects.length ? projects : ["No projects found"];
    }
    return ["No projects found"];
  };

  const extractCertifications = (text) => {
    const certificationsPattern = /certifications[\s\S]*/i;
    const certificationsMatch = text.match(certificationsPattern);
    if (certificationsMatch && certificationsMatch[0]) {
      const certificationsText = certificationsMatch[0]
        .replace(/(co-curricular|achievements)/i, "")
        .trim();
      const certifications = certificationsText
        .split(/[\n•]+/)
        .filter((c) => c.trim());
      return certifications.length
        ? certifications
        : ["No certifications found"];
    }
    return ["No certifications found"];
  };

  // Helper function to escape special characters in regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  return (
    <div className="bg-white rounded-md p-8 shadow-sm max-w-2xl mx-auto mt-10">

      {showEligibilityPopup && (
        <EligibilityPopup/>
      )}

      {!userExists ? (
        <>
          <p className="text-gray-800 font-semibold mb-6">
            Upload your resume to start the test
          </p>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed border-gray-900 rounded-md p-8 mt-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition-colors ${
              isUploading || isParsing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              !isUploading &&
              !isParsing &&
              document.getElementById("resumeInput").click()
            }
          >
            <AiOutlineCloudUpload className="w-16 h-16 text-gray-800" />
            <p className="text-gray-600 mt-4 text-center">
              Click here to upload your resume
            </p>
            <span className="text-sm text-gray-500">
              Acceptable file type: PDF (5MB max)
            </span>
            <input
              type="file"
              id="resumeInput"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading || isParsing}
            />
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="mt-6 flex items-center">
              <AiOutlineCheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="text-green-600 font-medium">
                Selected File: {selectedFile.name}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-600 px-5 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mt-6 bg-green-100 text-green-600 px-5 py-3 rounded-md">
              Resume parsed successfully! Redirecting to test...
            </div>
          )}

          {/* Parsing Stage Indicator */}
          {isParsing && (
            <div className="mt-4 flex items-center">
              <AiOutlineLoading3Quarters className="w-5 h-5 mr-2 animate-spin" />
              <span>Parsing...</span>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-8">
            <button
              onClick={handleResumeUpload}
              className={`inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isUploading || isParsing || !meetsCriteria
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={
                isUploading || isParsing || !selectedFile  || !meetsCriteria
               
              }
            >
              {isUploading || isParsing ? (
                <>
                  <AiOutlineLoading3Quarters className="w-5 h-5 mr-2 animate-spin" />
                  {isParsing ? "Parsing..." : "Uploading..."}
                </>
              ) : (
                "Upload and Start Test"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" />
            </svg>
            <p className="font-semibold">
              Great news! You've already completed the test.
              <br />
              Thank you for your participation!
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResumeUpload;
