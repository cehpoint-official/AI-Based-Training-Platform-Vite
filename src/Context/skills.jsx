// src/Context/skills.js
import React, { createContext, useState, useEffect } from 'react';

const skillsContext = createContext();

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState(() => {
    // Load skills from localStorage if available
    const savedSkills = localStorage.getItem('skills');
    return savedSkills ? JSON.parse(savedSkills) : {
      name: '',
      email: '',
      phone: '',
      skills: ['Corporate'],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };
  });

  useEffect(() => {
    // Save skills to localStorage whenever they change
    if (skills.name) { // Ensure to save only if there is a name
      localStorage.setItem('skills', JSON.stringify(skills));
    }
  }, [skills]);

  return (
    <skillsContext.Provider value={{ skills, setSkills }}>
      {children}
    </skillsContext.Provider>
  );
};

export default skillsContext;
