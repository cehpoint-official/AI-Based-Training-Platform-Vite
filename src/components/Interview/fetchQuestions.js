export const fetchQuestionsBySkills = async (skills) => {
  try {
    // Ensure that 'skills' is an array before sending it in the request
    const payload = { skills: Array.isArray(skills) ? skills : [] };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/fetch-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),  // Ensure correct structure is sent
    });

    // Check if the response status is OK
    if (!res.ok) {
      throw new Error(`Server error: ${res.statusText} (${res.status})`);
    }

    // Attempt to parse the response as JSON
    const data = await res.json();
    console.log('Fetched questions:', data); // Log the received data for debugging

    return data;
  } catch (error) {
    console.error('Error fetching questions: ', error);
    throw error; // Re-throw error so calling code can handle it
  }
};
