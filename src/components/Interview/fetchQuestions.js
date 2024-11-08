import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Adjust the path as necessary to import your Firestore db instance

export const fetchQuestionsBySkills = async (skills) => {
  try {
    const allQuestions = [];

    // Split skills into chunks of 30
    for (let i = 0; i < skills.length; i += 30) {
      const limitedSkills = skills.slice(i, i + 30);
      console.log(`Skills chunk: ${limitedSkills}`);
      
      const q = query(collection(db, "questions"), where("skills", "array-contains-any", limitedSkills));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        allQuestions.push({ id: doc.id, ...doc.data() });
      });
    }

    // Fetch additional questions using AI
    const additionalQuestions = await generateAdditionalQuestionsAI(skills, 5);
    console.log(additionalQuestions);

    return [...allQuestions, ...additionalQuestions];
  } catch (error) {
    console.error("Error fetching questions: ", error);
    throw error;
  }
};

const generateAdditionalQuestionsAI = async (skills, limit) => {
  const url = 'https://chat-gpt26.p.rapidapi.com/';

  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': '588f27f290msh8a5223a55a79a53p1f2c84jsn5bc65aefa67f',
      'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "Generate the hardest 5 questions."
        },
        {
          role: "user",
          content: `Here are skills: ${skills}. Generate ${limit} hardest questions, and avoid corporate topics.`
        }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 900,
      temperature: 0.9,
    }),
  };

  try {
    const response = await fetch(url, options);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("AI Response: ", result); // Debugging

    // Handle the text content returned by the AI (assuming format)
    const rawText = result.choices[0].message.content;

    // Parsing the response to extract questions properly
    const unwantedPhrases = [
      "Here are five challenging technical questions based on the skills you mentioned:",
      "Sure! Here are five challenging technical questions based on the listed skills:",
    ];
    
    const questionsArray = rawText
      .split(/\n\d+\.\s+/)
      .filter(q => q.trim() !== '' && !unwantedPhrases.some(phrase => q.includes(phrase)))
      .slice(1, 6) // Ensure we only take the first 5 questions
      .map((q, index) => ({
        id: `generated_${index + 1}`, // IDs will be from 1 to 5
        question: q.trim(),
        userAnswer: '',
        userTextAnswer: '',
        type: 'text',
        skills: "additional",
        isCorrect: null,
      }));

    console.log("Extracted questions:", questionsArray);
    return questionsArray;
  } catch (error) {
    console.error("Error generating additional questions from AI: ", error);
    throw error;
  }
};
