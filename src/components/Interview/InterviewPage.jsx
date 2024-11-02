import React, { useState } from 'react';
import RecordingModal from './Modal'; // Import the modal component
import Interview from './Interview'; // Import the Interview component

const InterviewPage = () => {
  const [showModal, setShowModal] = useState(true); // Control modal visibility

  // Close the modal when recording starts
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <RecordingModal show={showModal} onClose={handleCloseModal} />
      {/* Main interview content will be visible once modal is closed */}
      {!showModal && (
        <div>
          <h2>Interview Process</h2>
          {/* Render the Interview component where the AI interview happens */}
          <Interview />
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
