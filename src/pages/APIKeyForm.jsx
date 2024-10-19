// APIKeyForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APIKeyForm = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [unsplashKey, setUnsplashKey] = useState('');

  // Fetch existing keys when the component mounts
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await axios.get('/api/user/api-keys');
        setGeminiKey(response.data.geminiKey || '');
        setUnsplashKey(response.data.unsplashKey || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchKeys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/api-keys', {
        geminiKey,
        unsplashKey,
      });
      alert('API keys updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating API keys');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Gemini API Key:</label>
        <input
          type="text"
          value={geminiKey}
          onChange={(e) => setGeminiKey(e.target.value)}
          placeholder="Enter Gemini API Key"
        />
      </div>
      <div>
        <label>Unsplash API Key:</label>
        <input
          type="text"
          value={unsplashKey}
          onChange={(e) => setUnsplashKey(e.target.value)}
          placeholder="Enter Unsplash API Key"
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default APIKeyForm;
