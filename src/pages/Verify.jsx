import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
const Verify = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();
  const [processing, setProcessing] = useState(false);

  // Function to show toast messages
  const showToast = async (msg) => {
    setProcessing(false);
    toast(msg, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('uid'); // Fetch the user ID from session storage
    if (otp.length === 4 && userId) {
      setProcessing(true);
      try {
        const response = await axios.post('http://localhost:5000/api/verifyOTP', {
          otp:otp,
          userid: userId, // Send OTP and user ID (_id)
        });

        const data = response.data;
        if (data.success) {
          // Success toast message
          showToast('OTP verified successfully!');
          sessionStorage.setItem("verified",true);
          navigate("/home");
        } else {
          setError('Invalid OTP. Please try again.');
          showToast('Invalid OTP. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again later.');
        showToast('An error occurred. Please try again later.');
      }
    } else {
      setError('Please enter a 4-digit OTP.');
      showToast('Please enter a 4-digit OTP.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleInputChange}
            maxLength={4}
            placeholder="Enter 4-digit OTP"
            className="p-2 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-black"
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
            disabled={processing}
          >
            {processing ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
