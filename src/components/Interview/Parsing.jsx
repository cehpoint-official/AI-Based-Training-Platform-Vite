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
import { auth, db, storage } from "../../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeUpload = ({ onUploadComplete }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const { setSkills, skills } = useContext(skillsContext); // Access both setSkills and current skills
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
    console.log(user.email)
  }, [user, navigate]);

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
      console.log("Starting resume upload process...");
  
      // 1. Parse PDF and extract text - Add timeout and error handling
      const arrayBuffer = await selectedFile.arrayBuffer();
      console.log("File loaded into buffer");
  
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      console.log(loadingTask)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timeout')), 100000)
      );
  
      const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
      console.log("PDF document loaded");
  
      let extractedText = "";
      const textExtractionPromises = [];
  
      // Process pages in parallel
      for (let i = 1; i <= pdf.numPages; i++) {
        textExtractionPromises.push(
          pdf.getPage(i).then(async (page) => {
            const textContent = await page.getTextContent();
            return textContent.items.map(item => item.str).join(" ");
          })
        );
      }
  
      const pageTexts = await Promise.all(textExtractionPromises);
      extractedText = pageTexts.join("\n");
      console.log("Text extraction completed");
  
      if (!extractedText.trim()) {
        throw new Error("No text could be extracted from the PDF");
      }
  
      // 2. Parse the extracted text
      const parsedData = parseResumeText(extractedText);
      if (!parsedData.skills.includes('Corporate')) {
        parsedData.skills.push('Corporate');
      }
      console.log("Resume parsed successfully:", parsedData);
  
      // 3. Update skills context
      setSkills(prevSkills => ({
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
      console.log("Starting file upload to Firebase");
      const fileName = `resumes/${user.uid}_${Date.now()}.pdf`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, selectedFile);
      const fileUrl = await getDownloadURL(storageRef);
      console.log("File uploaded successfully");
  
      // 5. Prepare metadata for MongoDB
      const metadata = {
        fileName: selectedFile.name,
        fileUrl: fileUrl,
        userId: user.uid,
        userEmail: user.email || parsedData.contact.email || "Unknown",
        userName: user.displayName || parsedData.name || "Unknown",
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        projects: parsedData.projects,
        certifications: parsedData.certifications,
      };
  
      // 6. Save metadata to MongoDB
      console.log("Saving metadata to MongoDB");
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
        throw new Error(`Failed to save metadata to MongoDB: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log("Metadata saved successfully:", responseData);
  
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
            isUploading || isParsing
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          disabled={isUploading || isParsing || !selectedFile}
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
    </div>
  );
};

export default ResumeUpload;
