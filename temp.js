import React, { useEffect, useState } from "react";

const Projects = ({ courseTitle }) => {
  const [projectPages, setProjectPages] = useState([]); // Store array of arrays of projects
  const [currentPage, setCurrentPage] = useState(0); // Track the current page (set of 4 projects)
  const [loading, setLoading] = useState(false); // To show loading state
  const [selectedProject, setSelectedProject] = useState(null); // Store the selected project

  // Function to fetch projects using the API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": import.meta.env.VITE_API_KEY, // Use API Key from .env
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate 4 project ideas for the course: ${courseTitle}. 
                          Each project should be a title or brief description.
                          Format the response as an array of objects, with each object containing:
                          - "projectTitle": The project title or brief description.

                          Example format:
                          [
                            {
                              "projectTitle": "Build a weather forecasting app using React and Firebase"
                            },
                            {
                              "projectTitle": "Create a task management tool with real-time collaboration"
                            },
                            {
                              "projectTitle": "Develop a portfolio website with Tailwind CSS"
                            },
                            {
                              "projectTitle": "Design a quiz application with user authentication and Firebase"
                            }
                          ]

                          Please generate 4 project ideas in this format.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch projects: ${errorText}`);
      }

      const rawResponse = await response.text();
      const cleanedResponse = cleanResponse(rawResponse);
      const parsedProjects = parseProjectContent(cleanedResponse);

      setProjectPages((prevPages) => [...prevPages, parsedProjects]); // Add new set of 4 projects
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  // Clean response to remove unnecessary characters if any
  const cleanResponse = (response) => {
    return response.replace(/`/g, ""); // Remove backticks from the response if needed
  };

  // Parse project content to extract project titles from response
  const parseProjectContent = (response) => {
    try {
      let responseObj = JSON.parse(response);
      // Extract the text part of the response
      const nestedText = responseObj.candidates[0].content.parts[0].text;

      // Parse the nested text as JSON to convert it into an array of objects
      const projects = JSON.parse(nestedText);

      let projectTitlesArr = [];
      for (let project of projects) {
        projectTitlesArr.push(project.projectTitle);
      }

      // Extract and return the project titles
      return projectTitlesArr;
    } catch (error) {
      console.error("Error parsing project content:", error);
      return [];
    }
  };

  // Handle project selection
  const handleProjectSelection = (project) => {
    setSelectedProject(project);
  };

  // Handle the Next button click
  const handleNext = () => {
    if (currentPage < projectPages.length - 1) {
      // If the next set of projects already exists, go to the next page
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      // Otherwise, fetch a new set of projects
      fetchProjects();
    }
  };

  // Handle the Prev button click
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1); // Go to the previous page
    }
  };

  // Fetch initial set of projects when the component mounts
  useEffect(() => {
    if (courseTitle) {
      fetchProjects();
    }
  }, [courseTitle]);

  return (
    <div className="bg-white p-4">
      <h2 className="text-2xl font-bold mb-4">
        Project Suggestions for {courseTitle}
      </h2>

      {loading && <p>Loading project suggestions...</p>}

      {/* Show fetched project suggestions */}
      {!loading && projectPages.length > 0 && projectPages[currentPage] && (
        <ul className="mb-4">
          {projectPages[currentPage].map((project, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 mb-2 border ${
                selectedProject === project ? "bg-green-200" : "bg-gray-100"
              }`}
              onClick={() => handleProjectSelection(project)}
            >
              {project}
            </li>
          ))}
        </ul>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>

      {/* Display selected project */}
      {selectedProject && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Selected Project:</h3>
          <p>{selectedProject}</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
