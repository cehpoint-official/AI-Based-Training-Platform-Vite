
export const fetchQuestionsBySkills = async (skills) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // console.log("Sending request to fetch questions with skills:", skills);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skills }),
    });
    
    // console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const questions = await response.json();
    // console.log("Received questions from server:", questions);
    return questions;

  } catch (error) {
    // console.error("Error in fetchQuestionsBySkills:", error);
    throw error;
  }
};
