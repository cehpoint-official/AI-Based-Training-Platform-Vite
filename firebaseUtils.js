// Function to save the test report
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
        reportData: testReport 
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save test report');
    }
    const savedReport = await response.json();
    // console.log('Test report saved successfully:', savedReport);
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
    // console.log('Resume data uploaded successfully');
    return data;
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

// // Function to get test reports 
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

// Function to get resume data 
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

// // Function to upload resume file to Firebase Storage
export const uploadResumeFile = async (userName, resumeBlob) => {
  try {
    const response = await fetch('/upload-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, resumeBlob }),
    });
    if (!response.ok) throw new Error('Failed to upload resume file');
    const { filePath } = await response.json();
    console.log('Resume file uploaded successfully');
    return filePath;
  } catch (error) {
    console.error('Error uploading resume file:', error);
    throw error;
  }
};

export const addQuestionToFirebase = async (questionData) => {
  try {
    const response = await fetch('/add-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error('Failed to add question');
    console.log('Question added successfully');
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

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