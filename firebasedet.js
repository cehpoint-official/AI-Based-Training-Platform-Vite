import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from './firebaseConfig'; // Ensure correct import path

// Upload video recording to Firebase Storage
export const uploadRecording = async (userName, videoBlob, type, userId) => {
  const fileName = `${userName}${type}.webm`;
  const storageRef = ref(storage, `recordings/${fileName}`); // Use storage instead of db

  try {
    // Upload the recording to Firebase
    await uploadBytes(storageRef, videoBlob);
    console.log('Recording uploaded to Firebase');

    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(storageRef); // Ensure you import and use getDownloadURL from Firebase

    // Now call the update-recordings endpoint to update the user's recordings
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/updaterecordings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        screenUrl: type === 'screen' ? downloadURL : null,
        faceUrl: type === 'camera' ? downloadURL : null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update recordings in the database');
    }

    console.log('Recordings updated in the database successfully');
  } catch (error) {
    console.error('Error uploading recording to Firebase:', error);
    throw error;
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
