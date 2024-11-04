// =========================
// Report Analyzer with Firebase Integration and AI Evaluations
// =========================

// import {updateTestReportInFirebase} from '../firebaseUtils';

export const analyzeReportWithAI = async (report) => {
  // Filter out questions with 'Corporate' skill and ensure type is 'mcq' or 'text'
  const questionsToEvaluate = report.questions.filter(
    (q) =>
      (q.type === 'mcq' || q.type === 'text') &&
      !(q.skills && q.skills.includes('Corporate'))
  );

  const totalQuestions = questionsToEvaluate.length;

  if (totalQuestions === 0) {
    console.warn('No evaluable questions found in the report.');
    const emptyReport = generateEmptyReport(report);
    return emptyReport;
  }

  // Evaluate each question and collect results
  const evaluationPromises = questionsToEvaluate.map(async (question) => {
    const userAnswer = question.userAnswer;

    // Treat 'N/A', null, undefined, or empty string as unanswered
    if (!userAnswer || userAnswer.toLowerCase() === 'n/a') {
      console.warn(`No valid answer provided for question with ID: ${question.id}`);
      return { isCorrect: false, type: question.type };
    }

    try {
      if (question.type === 'mcq') {
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
  const evaluationResults = await Promise.all(evaluationPromises);

  // Aggregate the results
  let correctAnswers = 0;
  let mcqCorrect = 0;
  let textCorrect = 0;

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

  // Store the final report in Firestore
  // await updateTestReportInFirebase(id,finalReport);

  // Return the final analysis report
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
          role: 'system',
          content:
            'You are a chatbot that determines whether an answer is correct or wrong. Respond with only "correct" or "wrong".',
        },
        {
          role: 'user',
          content: `Question: "${question}".\nUser's Answer: "${userAnswer}".\nIf the answer is correct, return "correct"; otherwise, return "wrong".`,
        },
      ],
      model: 'gpt-3.5-turbo', // Corrected model name
      max_tokens: 20, // Reduced tokens since response is short
      temperature: 0, // Set to 0 for deterministic responses
    }),
  };

  try {
    const response = await fetch(url, options);

    // Check for a successful response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Extract evaluation from the response
    let evaluation = 'wrong'; // Default to 'wrong'
    if (result && result.choices && result.choices.length > 0) {
      evaluation = result.choices[0].message.content.trim().toLowerCase();
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
  const url = 'https://chat-gpt26.p.rapidapi.com/';

  // Create a query string for direct feedback request
  const query = `User ID: ${report.id} answered ${correctAnswers} out of ${totalQuestions} questions correctly, resulting in a score of ${scorePercentage}%. The user had the following job expectations: ${JSON.stringify(
    report.expectations
  )}. If it doesn't align with the performance, then motivate the user. Based on their score and expectations, provide performance feedback and suggest areas to study if necessary. Also, based on the report, indicate whether the salary is justified or not.`;

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
          role: 'system',
          content:
            'You are a performance report generator based on the data provided. The report should also indicate whether the expectations meet the performance or not.',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      model: 'gpt-3.5-turbo', // Corrected model name
      max_tokens: 200, // Increased tokens for a detailed response
      temperature: 0.7, // Balanced creativity
    }),
  };

  try {
    const response = await fetch(url, options);

    // Check for a successful response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Extracting the feedback from the response
    let feedback = 'Could not generate feedback.';
    if (result && result.choices && result.choices.length > 0) {
      feedback = result.choices[0].message.content.trim();
      console.log('AI Feedback:', feedback);
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
