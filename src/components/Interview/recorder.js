import { uploadRecording } from "../../../firebasedet";

let cameraRecorder, screenRecorder;
let cameraChunks = [];
let screenChunks = [];
let userStream; // Store the camera stream

// Utility functions to check support
const isScreenSharingSupported = () => {
  return 'getDisplayMedia' in navigator.mediaDevices;
};

const isCameraSupported = () => {
  return 'getUserMedia' in navigator.mediaDevices;
};

// Start screen and camera recording
export const startRecording = async () => {
  try {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    console.log('Device detected:', isMobile ? 'Mobile' : 'Desktop');

    // Fullscreen for desktop only (optional for mobile)
    if (!isMobile && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      console.log('Fullscreen enabled.');
    }

    console.log('Requesting permissions...');

    // Screen sharing for desktop
    let displayStream = null;
    if (!isMobile && isScreenSharingSupported()) {
      console.log('Screen sharing supported, requesting permission...');
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
    } else {
      console.log('Screen sharing not supported or mobile device detected.');
    }

    // Request camera and microphone permission (common for both desktop and mobile)
    if (isCameraSupported()) {
      userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Camera recording setup
      cameraRecorder = new MediaRecorder(userStream);
      cameraRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          cameraChunks.push(event.data);
        }
      };
      cameraRecorder.start();
      console.log('Camera recording started.');
    } else {
      throw new Error('Camera or microphone not supported on this device.');
    }

    // Screen recording setup (if screen sharing is supported)
    if (displayStream) {
      screenRecorder = new MediaRecorder(displayStream);
      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunks.push(event.data);
        }
      };
      screenRecorder.start();
      console.log('Screen recording started.');
    }

    // Handle ESC key to stop recording and upload (only for desktop)
    if (!isMobile) {
      document.addEventListener('keydown', handleEscKey);
    }

  } catch (error) {
    console.error('Error starting recording:', error.message);
    alert(`Error: ${error.message}`);
  }
};

// Stop recording and upload the video
export const stopRecording = async (userName) => {
  try {
    console.log('Stopping recordings...');

    // Stop camera recording
    if (cameraRecorder && cameraRecorder.state !== 'inactive') {
      cameraRecorder.stop();
    }

    // Stop screen recording (if started)
    if (screenRecorder && screenRecorder.state !== 'inactive') {
      screenRecorder.stop();
    }

    // Ensure recordings finish processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Upload camera recording
    if (cameraChunks.length > 0) {
      const cameraBlob = new Blob(cameraChunks, { type: 'video/webm' });
      await uploadRecording(userName, cameraBlob, 'camera');
      cameraChunks = [];
      console.log('Camera recording uploaded.');
    }

    // Upload screen recording (if available)
    if (screenChunks.length > 0) {
      const screenBlob = new Blob(screenChunks, { type: 'video/webm' });
      await uploadRecording(userName, screenBlob, 'screen');
      screenChunks = [];
      console.log('Screen recording uploaded.');
    }

    // Remove ESC key event listener (desktop only)
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      document.removeEventListener('keydown', handleEscKey);
    }

    // Exit fullscreen (desktop only)
    if (document.fullscreenElement) {
      document.exitFullscreen();
      console.log('Exited fullscreen mode.');
    }

  } catch (error) {
    console.error('Error stopping or uploading recordings:', error.message);
    alert(`Error: ${error.message}`);
  }
};

// Handle ESC key to stop recording (for desktop)
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    stopRecording('userNamePlaceholder'); // Replace with actual user data
    alert('Recording stopped.');
  }
};
