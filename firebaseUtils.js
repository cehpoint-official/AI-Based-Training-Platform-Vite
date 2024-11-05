// Import necessary Firebase functions
import { db, storage } from './firebaseConfig';
import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

// Function to save the test report to Firebase
export const saveTestReportToFirebase = async (testReport, name, email, uid) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/test-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        uid,
        reportData: testReport,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save test report');
    }
    const savedReport = await response.json();
    return savedReport;
  } catch (error) {
    console.error('Error saving test report:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

// Function to upload resume data
export const uploadResumeData = async (name, email, uid, resumeData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, uid, resumeData }),
    });
    if (!response.ok) throw new Error('Failed to upload resume data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

// Function to get test reports from Firebase
export const getTestReportsFromFirebase = async (uid) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/test-report/${uid}`);
    if (!response.ok) throw new Error('Failed to fetch test report');
    return await response.json();
  } catch (error) {
    console.error('Error fetching test reports:', error);
    return null;
  }
};

// Function to get resume data from Firebase
export const getResumeDataFromFirebase = async (uid) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/${uid}`);
    if (!response.ok) throw new Error('Failed to fetch resume data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return null;
  }
};

// Function to upload resume file to Firebase Storage
export const uploadResumeFile = async (userName, resumeBlob) => {
  const fileName = `${userName}.pdf`;
  const storageRef = ref(storage, `resumes/${fileName}`);

  try {
    await uploadBytes(storageRef, resumeBlob);
    console.log('Resume file uploaded to Firebase Storage');
    return `resumes/${fileName}`;
  } catch (error) {
    console.error('Error uploading resume file to Firebase:', error);
    throw error;
  }
};

// Function to add a question to Firebase
export const addQuestionToFirebase = async (questionData) => {
  try {
    const questionRef = collection(db, 'questions');
    await addDoc(questionRef, questionData);
    console.log('Question added successfully');
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

// Function to update the test report in Firebase
export const updateTestReportInFirebase = async (uid, updatedReportData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/update-test-report/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReportData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update test report');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating test report:', error);
    throw error;
  }
};
