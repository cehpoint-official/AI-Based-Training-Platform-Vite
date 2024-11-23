import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeReportWithAI = async (report) => {

  // Filter out questions with 'Corporate' skill and ensure type is 'mcq' or 'text'
  const questionsToEvaluate = report.questions.filter(
    (q) =>
      (q.type === 'text')
      //    || q.type === 'text') &&
      // !(q.skills && q.skills.includes('Corporate'))
  );
  const mcqQuestions = report.questions.filter((q)=>(q.type ==='mcq'));
  

  const totalQuestions = report.questions.length;

  if (totalQuestions === 0) {
    console.warn('No evaluable questions found in the report.');
    const emptyReport = generateEmptyReport(report);
    return emptyReport;
  }

  // Evaluate each question and collect results
  const evaluationPromises = questionsToEvaluate.map(async (question) => {
    const userAnswer = question.userTextAnswer;

    // Treat 'N/A', null, undefined, or empty string as unanswered
    if (!userAnswer || userAnswer.toLowerCase() === 'n/a') {
      console.warn(`No valid answer provided for question with ID: ${question.id}`);
      return { isCorrect: false, type: question.type };
    }

    try {
      if (question.type !== 'text') {
        // Evaluate MCQ questions
        const isCorrect = userAnswer === question.correctAnswer;
        return { isCorrect, type: 'mcq' };
      } else if (question.type === 'text') {
        // Evaluate text-based questions with AI
        const evaluation = await evaluateTextAnswerAI(question.question, question.userTextAnswer);
        question.aiEvaluation = evaluation; // Store AI evaluation in the report for future reference
        return { isCorrect: evaluation === 'correct', type: 'text' };
      } else {
        console.warn(`Unknown question type for question ID: ${question.id}`);
        return { isCorrect: false, type: question.type };
      }
    } catch (error) {
      console.error(`Error evaluating question ID: ${question.id}`, error);
      return { isCorrect: false, type: question.type };
    }
  });

  // Wait for all evaluations to complete
  //const evaluationResults = await Promise.all(evaluationPromises);
  

  // Aggregate the results
  let correctAnswers = 0;
  let mcqCorrect = 0;
  let textCorrect = 0;

 // Evaluate MCQs using index and question
 mcqQuestions.forEach((question, index) => {
  console.log(`Evaluating Question ${index + 1}: ${question.question}`);
  console.log(`User Answer: ${question.userAnswer}`);
  console.log(`Correct Answer: ${question.correctAnswer}`);

  // Compare userAnswer with correctAnswer
  if (question.userAnswer && question.userAnswer === question.correctAnswer) {
    correctAnswers++;
    // console.log(`Question ${index + 1}: Correct`);
  } else {
    // console.log(`Question ${index + 1}: Incorrect`);
  }
});



  const evaluationResults = await Promise.all(evaluationPromises);
  evaluationResults.forEach((result) => {
    if (result.isCorrect) {
      correctAnswers++;
      if (result.type === 'mcq') {
        mcqCorrect++;
      } else if (result.type === 'text') {
        textCorrect++;
      }
    }
  });
  // Calculate the total score percentage
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Calculate employability score based on the results
  const employabilityScore = calculateEmployabilityScore(scorePercentage);

  // Generate AI feedback based on performance
  const feedback = await generateAIReportFeedback(
    report,
    scorePercentage,
    correctAnswers,
    totalQuestions
  );

  // Generate the final report
  const finalReport = {
    totalQuestions,
    correctAnswers,
    mcqCorrect,
    textCorrect,
    scorePercentage: parseFloat(scorePercentage.toFixed(2)), // Round to 2 decimal places
    employabilityScore,
    feedback,
    suggestions: generateSuggestions(scorePercentage),
    additionalNotes: generateAdditionalNotes(scorePercentage),
    aiWords: generateAiWords(scorePercentage),
    fakePercentage: calculateFakePercentage(report),
    isHuman: determineIfHuman(report),
    timestamp: new Date(), // Add timestamp for record-keeping
    headers: report.headers || [], // Include headers from the original report
    urls: report.urls || [], // Include URLs from the original report
  };

  return finalReport;
};


// =========================
// Helper Functions
// =========================

/**
 * Function to evaluate text-based answers using AI
 * @param {string} question - The question text
 * @param {string} userAnswer - The user's answer
 * @returns {Promise<string>} - 'correct' or 'wrong'
 */
const evaluateTextAnswerAI = async (question, userAnswer) => {

  try {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
Evaluate the user's answer to the given question and respond with either "correct" or "wrong" without explanation.

Examples:
Question: "What is the capital of India?"
User's Answer: "New Delhi is the capital of India"
Response: "correct"

Question: "What is the capital of India?"
User's Answer: "India is the capital of India"
Response: "wrong"

Now evaluate:
Question: ${question}
User's Answer: ${userAnswer}
Response:
`;

  const result = await model.generateContent(prompt);
    console.log(result);
    // Extract evaluation from the response
    let evaluation = 'wrong'; // Default to 'wrong'
    if (result && result.response.text()) {
      evaluation = result.response.text().trim().toLowerCase();
      console.log('AI Evaluation:', evaluation);
    } else {
      console.error('AI did not return a valid evaluation:', result);
    }

    return evaluation === 'correct' ? 'correct' : 'wrong';
  } catch (error) {
    console.error('Error evaluating text answer:', error.message);
    return 'wrong'; // Treat errors as wrong
  }
};

/**
 * Function to generate AI-based feedback based on performance
 * @param {Object} report - The report object
 * @param {number} scorePercentage - The user's score percentage
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total number of questions evaluated
 * @returns {Promise<string>} - Feedback message
 */
const generateAIReportFeedback = async (
  report,
  scorePercentage,
  correctAnswers,
  totalQuestions
) => {
  const query = `User ID: ${report.id} answered ${correctAnswers} out of ${totalQuestions} questions correctly, resulting in a score of ${scorePercentage}%. The user had the following job expectations: ${JSON.stringify(report.expectations)}. Provide performance feedback and suggest areas to study if necessary.`;

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(query);

    // console.log('Raw AI Feedback Result:', result); // Debug log

    let feedback = 'Could not generate feedback.';
    if (result && result.response && result.response.text()) {
      feedback = result.response.text().trim();
    } else {
      console.error('AI feedback generation failed. No valid response:', result);
    }
    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error.message);
    return 'Error generating feedback. Please try again.';
  }
};


/**
 * Helper function to calculate employability score based on score percentage
 * @param {number} scorePercentage - The user's score percentage
 * @returns {string} - 'High', 'Medium', or 'Low'
 */
const calculateEmployabilityScore = (scorePercentage) => {
  if (scorePercentage >= 70) return 'High';
  if (scorePercentage >= 50) return 'Medium';
  return 'Low';
};

/**
 * Helper function to generate suggestions based on score percentage
 * @param {number} scorePercentage - The user's score percentage
 * @returns {Array<string>} - Array of suggestion strings
 */
const generateSuggestions = (scorePercentage) => {
  if (scorePercentage >= 90) {
    return ['Maintain your excellent performance!', 'Consider mentoring others.'];
  } else if (scorePercentage >= 70) {
    return ['Focus on weaker areas to achieve higher scores.', 'Practice more MCQ questions.'];
  } else if (scorePercentage >= 50) {
    return ['Review all topics thoroughly.', 'Seek additional resources or tutoring.'];
  } else {
    return [
      'Revisit the course material.',
      'Engage in intensive study sessions.',
      'Consider professional guidance.',
    ];
  }
};

/**
 * Helper function to generate additional notes based on score percentage
 * @param {number} scorePercentage - The user's score percentage
 * @returns {string} - Additional notes
 */
const generateAdditionalNotes = (scorePercentage) => {
  if (scorePercentage >= 90) {
    return 'Outstanding performance! Keep up the great work.';
  } else if (scorePercentage >= 70) {
    return 'Good effort. A little more focus can lead to even better results.';
  } else if (scorePercentage >= 50) {
    return 'You are making progress, but there is room for improvement.';
  } else {
    return 'It appears that you are struggling with the material. Consider seeking help.';
  }
};

/**
 * Helper function to generate aiWords based on score percentage
 * @param {number} scorePercentage - The user's score percentage
 * @returns {string} - Descriptive word for performance
 */
const generateAiWords = (scorePercentage) => {
  if (scorePercentage >= 90) {
    return 'Exceptional';
  } else if (scorePercentage >= 70) {
    return 'Proficient';
  } else if (scorePercentage >= 50) {
    return 'Basic';
  } else {
    return 'Needs Improvement';
  }
};

/**
 * Simulated function to calculate fakePercentage
 * @param {Object} report - The report object
 * @returns {number} - Fake percentage (fixed for testing)
 */
const calculateFakePercentage = (report) => {
  // In a real scenario, implement logic to determine fakePercentage
  return 0; // Fixed value for testing purposes
};

/**
 * Simulated function to determine if the report is human-generated
 * @param {Object} report - The report object
 * @returns {boolean} - True if human-generated, else false
 */
const determineIfHuman = (report) => {
  // In a real scenario, implement logic to verify if the report is human-generated
  return true; // Fixed value for testing purposes
};

/**
 * Helper function to generate an empty report when no questions are present
 * @param {Object} report - The original report object
 * @returns {Object} - Empty report object
 */
const generateEmptyReport = (report) => ({
  totalQuestions: 0,
  correctAnswers: 0,
  mcqCorrect: 0,
  textCorrect: 0,
  scorePercentage: 0,
  employabilityScore: 'Low',
  feedback: 'No questions were evaluated.',
  suggestions: [],
  additionalNotes: '',
  aiWords: null,
  fakePercentage: null,
  isHuman: null,
  timestamp: new Date(), // Add timestamp for record-keeping
  headers: report.headers || [], // Include headers from the original report
  urls: report.urls || [], // Include URLs from the original report
});

// import { GoogleGenerativeAI } from '@google/generative-ai';

// /**
//  * Main function to analyze a report using AI
//  * @param {Object} report - The report object containing questions, answers, and other metadata
//  * @returns {Object} - Final report with evaluation results
//  */
// export const analyzeReportWithAI = async (report) => {
//   const questionsToEvaluate = report.questions.filter((q) => q.type === 'text');
//   const mcqQuestions = report.questions.filter((q) => q.type === 'mcq');
//   const totalQuestions = report.questions.length;

//   if (totalQuestions === 0) {
//     console.warn('No evaluable questions found in the report.');
//     return generateEmptyReport(report);
//   }

//   // Evaluate MCQs
//   let mcqCorrect = 0;
//   mcqQuestions.forEach((question) => {
//     if (question.userAnswer && question.userAnswer === question.correctAnswer) {
//       mcqCorrect++;
//     }
//   });

//   // Evaluate text-based questions
//   const textEvaluationResults = [];
//   for (const question of questionsToEvaluate) {
//     const userAnswer = question.userTextAnswer;

//     if (!userAnswer || userAnswer.toLowerCase() === 'n/a') {
//       console.warn(`No valid answer for question ID: ${question.id}`);
//       textEvaluationResults.push({ isCorrect: false, type: 'text' });
//       continue;
//     }

//     try {
//       const evaluation = await evaluateTextAnswerAI(question.question, userAnswer);
//       textEvaluationResults.push({
//         isCorrect: evaluation === 'correct',
//         type: 'text',
//       });
//     } catch (error) {
//       console.error(`Error evaluating text question ID: ${question.id}`, error);
//       textEvaluationResults.push({ isCorrect: false, type: 'text' });
//     }

//     // Add increased delay to prevent rate-limiting errors
//     await delay(3000); // 3 seconds delay
//   }

//   // Aggregate results
//   const correctAnswers = mcqCorrect + textEvaluationResults.filter((r) => r.isCorrect).length;
//   const textCorrect = textEvaluationResults.filter((r) => r.isCorrect).length;
//   const scorePercentage = (correctAnswers / totalQuestions) * 100;
//   const employabilityScore = calculateEmployabilityScore(scorePercentage);

//   // Generate feedback and suggestions
//   const feedback = await generateAIReportFeedback(report, scorePercentage, correctAnswers, totalQuestions);

//   // Final report
//   const finalReport = {
//     totalQuestions,
//     correctAnswers,
//     mcqCorrect,
//     textCorrect,
//     scorePercentage: parseFloat(scorePercentage.toFixed(2)),
//     employabilityScore,
//     feedback,
//     suggestions: generateSuggestions(scorePercentage),
//     additionalNotes: generateAdditionalNotes(scorePercentage),
//     aiWords: generateAiWords(scorePercentage),
//     fakePercentage: calculateFakePercentage(report),
//     isHuman: determineIfHuman(report),
//     timestamp: new Date(),
//     headers: report.headers || [],
//     urls: report.urls || [],
//   };

//   return finalReport;
// };

// /**
//  * Function to evaluate text-based answers using AI
//  * @param {string} question - The question text
//  * @param {string} userAnswer - The user's answer
//  * @returns {Promise<string>} - 'correct' or 'wrong'
//  */
// const evaluateTextAnswerAI = async (question, userAnswer) => {
//   try {
//     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const prompt = `
// Evaluate the user's answer to the given question and respond with either "correct" or "wrong" without explanation.

// Examples:
// Question: "What is the capital of India?"
// User's Answer: "New Delhi is the capital of India"
// Response: "correct"

// Question: "What is the capital of India?"
// User's Answer: "India is the capital of India"
// Response: "wrong"

// Now evaluate:
// Question: ${question}
// User's Answer: ${userAnswer}
// Response:
// `;

//     const result = await model.generateContent(prompt);
//     const evaluation = result?.response?.text()?.trim().toLowerCase() || 'wrong';
//     return evaluation;
//   } catch (error) {
//     console.error('Error evaluating text answer:', error.message);
//     return 'wrong'; // Default to "wrong" in case of an error
//   }
// };

// /**
//  * Generate AI-based feedback
//  */
// const generateAIReportFeedback = async (report, scorePercentage, correctAnswers, totalQuestions) => {
//   const query = `User answered ${correctAnswers} out of ${totalQuestions} correctly, scoring ${scorePercentage}%. Job expectations: ${JSON.stringify(
//     report.expectations
//   )}. Provide feedback and study suggestions.`;

//   try {
//     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(query);
//     return result?.response?.text()?.trim() || 'Feedback could not be generated.';
//   } catch (error) {
//     console.error('Error generating feedback:', error.message);
//     return 'Error generating feedback. Please try again.';
//   }
// };

// /**
//  * Delay execution to avoid rate-limiting
//  * @param {number} ms - Milliseconds to delay
//  */
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /**
//  * Helper functions for report generation
//  */
// const calculateEmployabilityScore = (scorePercentage) =>
//   scorePercentage >= 70 ? 'High' : scorePercentage >= 50 ? 'Medium' : 'Low';
// const generateSuggestions = (scorePercentage) =>
//   scorePercentage >= 90 ? ['Excellent work!'] : ['Review materials.', 'Practice questions.'];
// const generateAdditionalNotes = (scorePercentage) =>
//   scorePercentage >= 90 ? 'Great job!' : 'Keep working hard!';
// const generateAiWords = (scorePercentage) =>
//   scorePercentage >= 90 ? 'Exceptional' : scorePercentage >= 70 ? 'Proficient' : 'Needs Improvement';
// const calculateFakePercentage = () => 0; // Placeholder for actual logic
// const determineIfHuman = () => true; // Placeholder for actual logic;

// const generateEmptyReport = (report) => ({
//   totalQuestions: 0,
//   correctAnswers: 0,
//   mcqCorrect: 0,
//   textCorrect: 0,
//   scorePercentage: 0,
//   employabilityScore: 'Low',
//   feedback: 'No evaluable questions.',
//   suggestions: [],
//   additionalNotes: '',
//   aiWords: '',
//   fakePercentage: null,
//   isHuman: null,
//   timestamp: new Date(),
//   headers: report.headers || [],
//   urls: report.urls || [],
// });
