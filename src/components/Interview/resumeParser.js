// src/utils/resumeParser.js
import nlp from 'compromise';

/**
 * Preprocess the extracted text by removing unwanted characters and normalizing spaces.
 * @param {string} text - The raw text extracted from the resume.
 * @returns {string} - The preprocessed text.
 */
export const preprocessText = (text) => {
  return text
    .replace(/[^a-zA-Z0-9\s.,@+\-]/g, ' ') // Remove special characters except common ones
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
};

/**
 * Extract specific sections from the resume text based on section names.
 * @param {string} text - The preprocessed resume text.
 * @param {Array<string>} sectionNames - An array of possible section names (e.g., ['skills', 'technical skills']).
 * @returns {string|null} - The extracted section text or null if not found.
 */
export const getSection = (text, sectionNames) => {
  const regex = new RegExp(
    `(${sectionNames.join('|')})[\\s:\\-]*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z][a-z]|$)`,
    'i'
  );
  const match = text.match(regex);
  return match && match[2] ? match[2].trim() : null;
};

/**
 * Extract the candidate's name from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {string} - The extracted name or a fallback message.
 */
export const extractName = (text) => {
  const doc = nlp(text);
  const people = doc.people().out('array');

  if (people.length > 0) {
    return people[0];
  }

  // Fallback: Assume the first line contains the name
  const firstLine = text.split('\n')[0].trim();
  return firstLine || 'Name not found';
};

/**
 * Extract contact information (email and phone) from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {Object} - An object containing email and phone.
 */
export const extractContactInfo = (text) => {
  const emailMatch = text.match(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  );

  const phoneMatch = text.match(
    /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/
  );

  return {
    email: emailMatch ? emailMatch[1] : 'No email found',
    phone: phoneMatch ? phoneMatch[0] : 'No phone number found',
  };
};

/**
 * Extract skills from the resume text by identifying the Skills section.
 * @param {string} text - The preprocessed resume text.
 * @returns {Array<string>} - An array of extracted skills.
 */
export const extractSkills = (text) => {
  const skillsSection = getSection(text, ['skills', 'technical skills', 'core competencies']);

  if (skillsSection) {
    const skills = skillsSection
      .replace(/skills:?/i, '') // Remove the heading
      .split(/[\n•,]+/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    // Remove duplicates and ensure 'Corporate Skill' is added
    const uniqueSkills = Array.from(new Set([...skills, 'Corporate Skill']));

    return uniqueSkills.length > 0 ? uniqueSkills : ['Corporate Skill'];
  }

  return ['Corporate Skill']; // Default return
};

/**
 * Extract experience details from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {Array<string>} - An array of extracted experiences.
 */
export const extractExperience = (text) => {
  const experienceSection = getSection(text, ['experience', 'professional experience', 'work experience']);

  if (experienceSection) {
    const experiences = experienceSection
      .split(/[\n•]+/)
      .map((exp) => exp.trim())
      .filter((exp) => exp.length > 0);
    return experiences.length ? experiences : ['No experience found'];
  }

  return ['No experience found'];
};

/**
 * Extract education details from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {Array<string>} - An array of extracted education entries.
 */
export const extractEducation = (text) => {
  const educationSection = getSection(text, ['education', 'academic background']);

  if (educationSection) {
    const education = educationSection
      .split(/[\n•]+/)
      .map((edu) => edu.trim())
      .filter((edu) => edu.length > 0);
    return education.length ? education : ['No education found'];
  }

  return ['No education found'];
};

/**
 * Extract project details from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {Array<string>} - An array of extracted projects.
 */
export const extractProjects = (text) => {
  const projectsSection = getSection(text, ['projects', 'key projects']);

  if (projectsSection) {
    const projects = projectsSection
      .split(/[\n•]+/)
      .map((proj) => proj.trim())
      .filter((proj) => proj.length > 0);
    return projects.length ? projects : ['No projects found'];
  }

  return ['No projects found'];
};

/**
 * Extract certifications from the resume text.
 * @param {string} text - The preprocessed resume text.
 * @returns {Array<string>} - An array of extracted certifications.
 */
export const extractCertifications = (text) => {
  const certificationsSection = getSection(text, ['certifications', 'certificates']);

  if (certificationsSection) {
    const certifications = certificationsSection
      .split(/[\n•]+/)
      .map((cert) => cert.trim())
      .filter((cert) => cert.length > 0);
    return certifications.length ? certifications : ['No certifications found'];
  }

  return ['No certifications found'];
};

/**
 * Parse the entire resume text into structured data.
 * @param {string} text - The preprocessed resume text.
 * @returns {Object} - An object containing all extracted data.
 */
export const parseResumeText = (text) => {
  return {
    name: extractName(text),
    contact: extractContactInfo(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    projects: extractProjects(text),
    certifications: extractCertifications(text),
  };
};
