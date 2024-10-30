import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './record.css';
import ResumeUpload from './Parsing'; // Resume parsing component

const RecordPage = () => {
  const [name, setName] = useState(''); // To store the user's name
  const [isRecording, setIsRecording] = useState(false); // To track recording status
  const [resumeUploaded, setResumeUploaded] = useState(false); // To track resume upload status
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const cameraRef = useRef(null);
  const screenRef = useRef(null);
  const cameraRecorder = useRef(null);
  const screenRecorder = useRef(null);
  const cameraChunks = useRef([]);
  const screenChunks = useRef([]);
  const navigate = useNavigate();

  // Variables to track when both recordings have stopped
  let cameraStopped = false;
  let screenStopped = false;

  // Function to handle recording
  const startRecording = async () => {
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });

      setCameraStream(camera);
      setScreenStream(screen);

      if (cameraRef.current) {
        cameraRef.current.srcObject = camera;
      }
      if (screenRef.current) {
        screenRef.current.srcObject = screen;
      }

      console.log('Starting camera recorder...');
      cameraRecorder.current = new MediaRecorder(camera);
      console.log('Starting screen recorder...');
      screenRecorder.current = new MediaRecorder(screen);

      // Handle camera data
      cameraRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Camera data available: ${event.data.size}`); // Log camera data size
          cameraChunks.current.push(event.data);
        } else {
          console.log('No camera data available.');
        }
      };

      // Handle screen data
      screenRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Screen data available: ${event.data.size}`); // Log screen data size
          screenChunks.current.push(event.data);
        }
      };

      // Stop and upload when either camera or screen stops
      cameraRecorder.current.onstop = () => {
        cameraStopped = true;
        console.log('Camera recorder stopped.');
        if (screenStopped) {
          console.log('Both recordings stopped, starting upload...');
          uploadRecordings(); // Upload both recordings
        }
      };

      screenRecorder.current.onstop = () => {
        screenStopped = true;
        console.log('Screen recorder stopped.');
        if (cameraStopped) {
          console.log('Both recordings stopped, starting upload...');
          uploadRecordings(); // Upload both recordings
        }
      };

      cameraRecorder.current.start();
      screenRecorder.current.start();
      setIsRecording(true);

      // Redirect to InterviewPage after starting recording
      setTimeout(() => {
        navigate('/interview');
      }, 1000); // Short delay to ensure recording has started
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Function to handle stopping both camera and screen recordings
  const stopBothRecordings = () => {
    if (cameraRecorder.current) {
      console.log('Stopping camera recorder...');
      cameraRecorder.current.stop(); // Stop camera recording
    }
    if (screenRecorder.current) {
      console.log('Stopping screen recorder...');
      screenRecorder.current.stop(); // Stop screen recording
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop()); // Stop camera stream tracks
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop()); // Stop screen stream tracks
    }
    setIsRecording(false);
  };

  // Function to upload both recordings to Firebase
  const uploadRecordings = async () => {
    // Upload camera recording to Firebase
    if (cameraChunks.current.length > 0) {
      const cameraBlob = new Blob(cameraChunks.current, { type: 'video/webm' });
      const cameraFileRef = ref(storage, `recordings/${name}-camera-${Date.now()}.webm`);
      const cameraUploadTask = uploadBytesResumable(cameraFileRef, cameraBlob);

      cameraUploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log('Camera upload progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%');
        },
        (error) => {
          console.error('Camera upload error:', error);
        },
        async () => {
          const cameraDownloadURL = await getDownloadURL(cameraFileRef);
          await addDoc(collection(db, 'recordings'), {
            name,
            cameraUrl: cameraDownloadURL,
            createdAt: serverTimestamp(),
          });
          console.log('Camera recording uploaded successfully!');
        }
      );
    }

    // Upload screen recording to Firebase
    if (screenChunks.current.length > 0) {
      const screenBlob = new Blob(screenChunks.current, { type: 'video/webm' });
      const screenFileRef = ref(storage, `recordings/${name}-screen-${Date.now()}.webm`);
      const screenUploadTask = uploadBytesResumable(screenFileRef, screenBlob);

      screenUploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log('Screen upload progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%');
        },
        (error) => {
          console.error('Screen upload error:', error);
        },
        async () => {
          const screenDownloadURL = await getDownloadURL(screenFileRef);
          await addDoc(collection(db, 'recordings'), {
            name,
            screenUrl: screenDownloadURL,
            createdAt: serverTimestamp(),
          });
          console.log('Screen recording uploaded successfully!');
        }
      );
    }
  };

  // Function to handle stopping the recording manually
  const stopRecording = () => {
    console.log('Stopping both recordings...');
    stopBothRecordings();
  };

  // Function to handle resume upload status
  const handleResumeUpload = (uploaded) => {
    setResumeUploaded(uploaded);
  };

  return (
    <div className='canvas-record'>
      <h1>Welcome to Our Portal</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ResumeUpload onUploadComplete={handleResumeUpload} /> {/* Pass callback to handle resume upload */}
      <div>
        {!isRecording ? (
          <button onClick={startRecording} disabled={!name || !resumeUploaded}> {/* Enable button only when both name and resume are provided */}
            Grant Permission
          </button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
