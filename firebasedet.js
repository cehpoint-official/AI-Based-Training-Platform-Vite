// src/firebase.js
import { ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from './firebaseConfig'; // Ensure correct import path

// Upload video recording to Firebase Storage
export const uploadRecording = async (userName, videoBlob,type) => {
  const fileName = `${userName}${type}.webm`;
  const storageRef = ref(storage, `recordings/${fileName}`); // Use storage instead of db

  try {
    await uploadBytes(storageRef, videoBlob);
    console.log('Recording uploaded to Firebase');
  } catch (error) {
    console.error('Error uploading recording to Firebase:', error);
    throw error; // Optionally rethrow to handle higher up
  }
};

// Upload parsed resume data to Firebase Firestore
export const uploadResumeData = async (userName, userEmail, parsedData) => {
  try {
    const userRef = doc(db, 'resumes', userName); // Use 'resumes' for consistency
    await setDoc(userRef, { name: userName, email: userEmail, resume: parsedData });
    console.log('Resume data uploaded to Firestore');
  } catch (error) {
    console.error('Error uploading data to Firestore:', error);
    throw error; // Optionally rethrow to handle higher up
  }
};
