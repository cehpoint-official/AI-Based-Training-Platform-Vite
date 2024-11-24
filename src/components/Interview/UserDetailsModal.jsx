import React, { useState } from 'react';
import ResumeUpload from './Parsing'; // Ensure the correct import path
import { AiOutlineCheckCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import image from '../../assets/image3.svg'
import SvgSection from './SvgSection';

const UserDetailsModal = ({ setUserDetails, setResumeData, onClose }) => {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleResumeUploadComplete = (success, data) => {
    setLoading(false);
    if (success && data) {  // Check if both success and data exist
      setResumeData(data);
      setParsedData(data);
      setResumeUploaded(true);
      // Automatically close the modal after 2 seconds
      setTimeout(() => {
        setUserDetails({ 
          name: data.userName || null, 
          email: data.userEmail || null 
        });
        onClose();
      }, 2000);
    } else {
      alert('Failed to upload resume. Please try again.');
    }
  };

  const handleResumeUploadStart = () => {
    setLoading(true);
  };

  
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row z-50 w-full h-full bg-gray-50">
      {/* Content Section */}
      <div className=" bg- md:p-10 w-full md:w-1/2 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-white px-5 w-full h-full rounded-lg ">
          <div className='space-y-1'>
          <h2 className="text-xl md:text-2xl font-bold  text-gray-800 text-center">
            One Step Closer to Your Dream Offer
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600">
            Take a step ahead in your career
          </p>
          </div>
          
          <div>
          <ResumeUpload
            onUploadStart={handleResumeUploadStart}
            onUploadComplete={handleResumeUploadComplete}
          />
          </div>
          

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center mt-4">
              <AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-indigo-500" />
            </div>
          )}

          {/* Success Message */}
          {/* {resumeUploaded && parsedData && (
            <div className="flex items-center justify-center">
              <AiOutlineCheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-green-600 font-medium">
                Resume uploaded successfully!
              </span>
            </div>
          )} */}
        </div>
      </div>

      {/* SVG Section */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 p-4 md:p-14">
        <SvgSection image={image} />
      </div>
    </div>
  );
};

export default UserDetailsModal;
