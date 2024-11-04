// src/data/mockQuizData.js

const mockQuizzes = {
  "General Knowledge": [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Michelangelo",
      ],
      answer: "Leonardo da Vinci",
    },
    {
      question: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      answer: "Pacific Ocean",
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1945", "1947", "1950"],
      answer: "1945",
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      answer: "Au",
    },
    {
      question: "Which country is home to the kangaroo?",
      options: ["New Zealand", "South Africa", "Australia", "Brazil"],
      answer: "Australia",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      answer: "Blue Whale",
    },
    {
      question: "In which year did the Titanic sink?",
      options: ["1905", "1912", "1920", "1931"],
      answer: "1912",
    },
  ],
};

export const fetchMockQuiz = (courseTitle) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const quiz = mockQuizzes[courseTitle] || mockQuizzes["General Knowledge"];
      resolve(quiz);
    }, 1000); // Simulate network delay
  });
};
