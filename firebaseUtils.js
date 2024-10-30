// src/firebaseUtils.js
import { db, storage } from './firebaseConfig';
import { collection, addDoc, doc, getDoc, setDoc,updateDoc} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

// Function to save the test report to Firebase
export const saveTestReportToFirebase = async (testReport, username) => {
  try {
    const reportRef = doc(db, "testReport", username);
    await setDoc(reportRef, {
      ...testReport,
      createdAt: new Date(),
    });
    console.log('Test report saved successfully');
  } catch (error) {
    console.error('Error saving test report:', error);
  }
};
// Function to upload resume data to Firestore
export const uploadResumeData = async (name, email, resumeData) => {
  try {
    const resumeRef = doc(db, 'resumes', name);
    await setDoc(resumeRef, {
      name,
      email,
      resumeData,
      createdAt: new Date(),
    });
    console.log('Resume data uploaded successfully');
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

// Function to get test reports from Firebase
export const getTestReportsFromFirebase = async (username) => {
  try {
    const reportRef = doc(db, 'testReport', username);
    const reportSnapshot = await getDoc(reportRef);
    
    if (reportSnapshot.exists()) {
      return { id: reportSnapshot.id, ...reportSnapshot.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching test reports:', error);
    return null;
  }
};

// Function to get resume data from Firebase
export const getResumeDataFromFirebase = async (username) => {
  try {
    const reportRef = doc(db, 'resumes', username);
    const reportSnapshot = await getDoc(reportRef);
    
    if (reportSnapshot.exists()) {
      return { id: reportSnapshot.id, ...reportSnapshot.data() };
    } else {
      console.log('No such document!');
      return null;
    }
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
    
    // Return the path of the uploaded resume
    return `resumes/${fileName}`;
  } catch (error) {
    console.error('Error uploading resume file to Firebase:', error);
    throw error;
  }
};
export const addQuestionToFirebase = async (questionData) => {
  try {
    const questionRef = collection(db, 'questions'); // Store questions in the 'questions' collection
    await addDoc(questionRef, questionData);
    console.log('Question added successfully');
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const updateTestReportInFirebase = async (username, updatedReport) => {
  const reportRef = doc(db, 'testReport', username);
  await updateDoc(reportRef, updatedReport);
};
