import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../firebase'; // Adjust the path as needed
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load draft from localStorage on component mount
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('resumeDraft'));
    if (draft) {
      setSelectedFile(draft.selectedFile);
      setKeywords(draft.keywords.join(', '));
    }
  }, []);

  // Save draft to localStorage whenever selectedFile or keywords change
  useEffect(() => {
    const draft = {
      selectedFile,
      keywords: keywords.split(',').map((kw) => kw.trim()),
    };
    localStorage.setItem('resumeDraft', JSON.stringify(draft));
  }, [selectedFile, keywords]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Invalid file type or size. Please upload a PDF or DOCX file under 5MB.');
    }
  };

  const handleKeywordChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000); // Reset after 3 seconds
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && validTypes.includes(file.type) && file.size <= maxSize) {
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a valid resume file to upload.');
      return;
    }
    if (keywords.trim() === '') {
      setError('Please add at least one keyword.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Upload file to Firebase Storage
      setUploading(true);
      const storageRef = ref(storage, `resumes/${selectedFile.name}_${Date.now()}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);

      // Submit data to Firestore
      const keywordsArray = keywords.split(',').map((kw) => kw.trim());
      await addDoc(collection(firestore, 'resumes'), {
        fileName: selectedFile.name,
        fileURL: downloadURL,
        keywords: keywordsArray,
        uploadedAt: new Date(),
      });

      // Clear draft from localStorage
      localStorage.removeItem('resumeDraft');

      setUploadSuccess(true);
      setSelectedFile(null);
      setKeywords('');
      setSubmitting(false);
      setTimeout(() => setUploadSuccess(false), 3000); // Reset after 3 seconds
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload resume. Please try again.');
      setUploading(false);
      setSubmitting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Invalid file type or size. Please upload a PDF or DOCX file under 5MB.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md p-8 font-poppins text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Your Resume</h2>
      <p className="text-gray-400 text-center mb-6">
        Help us get to know you better by sharing your resume.
      </p>

      <div
        className="border-2 border-dashed border-gray-500 rounded-md p-6 mt-4 flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resumeInput').click()}
      >
        <AiOutlineCloudUpload className="w-12 h-12 text-gray-400" />
        <p className="text-gray-300 mt-2">
          Drag your resume here or click to upload
        </p>
        <span className="text-sm text-gray-400">
          Acceptable file types: PDF, DOCX (5MB max)
        </span>
        <input
          type="file"
          id="resumeInput"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center">
          <AiOutlineCheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-400">Selected File: {selectedFile.name}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-600 text-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4 bg-green-600 text-green-100 px-4 py-2 rounded">
          Resume uploaded successfully!
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-300 mb-1">
          Add Keywords to Highlight Your Skills
        </label>
        <input
          type="text"
          id="keywords"
          className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 p-2"
          placeholder="Type your keywords here, separated by commas..."
          value={keywords}
          onChange={handleKeywordChange}
        />
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSaveDraft}
          className="flex items-center justify-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          {draftSaved ? (
            <>
              <AiOutlineCheckCircle className="w-5 h-5 mr-2" />
              Draft Saved!
            </>
          ) : (
            'Save as Draft'
          )}
        </button>
        <button
          onClick={handleSubmit}
          className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            submitting || uploading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition`}
          disabled={submitting || uploading}
        >
          {submitting || uploading ? (
            <>
              <AiOutlineLoading3Quarters className="w-5 h-5 mr-2 animate-spin" />
              {uploading ? 'Uploading...' : 'Submitting...'}
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
}
