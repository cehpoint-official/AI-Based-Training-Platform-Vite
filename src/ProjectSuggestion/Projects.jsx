import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axiosInstance from "../axios";

const Projects = ({ courseTitle }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [projectPages, setProjectPages] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user) {
      const displayName = user.displayName;
      const emailFromGoogle = user.providerData[0]?.email;
  
      // Only update if the value has actually changed
      if (displayName !== userName) {
        setUserName(displayName || "User");
      }
  
      if (emailFromGoogle !== userEmail) {
        setUserEmail(emailFromGoogle || user.email || "");
      }
    } else {
      // If user is not signed in, reset email
      if (userEmail !== "") setUserEmail(""); 
    }
  }, [user, userName, userEmail]);

  // console.log(userEmail)

  useEffect(() => {
    async function fetchUser() {
      try {
        const postURL = `/api/getusers`;
        const response = await axiosInstance.get(postURL);
        console.log("Response from API:", response.data);
  
        // Use .find() to locate the user by email
        const user = response.data.find(user => user.email === userEmail);
  
        if (user && user._id) {
          console.log("User ID found:", user._id);
          setUserId(user._id); // Set the user ID in state
        } else {
          console.error("User not found or ID is missing in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchUser();
  }, []);  

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

  const saveProject = async () => {
    if (!selectedProject || !userId || !userEmail) {
      console.log("No project selected, userId, or userEmail not available.");
      return; // Ensure a project is selected and necessary data is available
    }
  
    console.log("Saving project:", selectedProject, "for user ID:", userId);
  
    try {
      const response = await fetch('http://localhost:5000/api/projectSaved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectTitle: selectedProject,
          userId: userId,         // Send userId
          email: userEmail,       // Send user's email
          completed: false,       // Set default value for completed
          github_url: ""          // Optionally send the GitHub URL if available
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save project:", errorText);
        throw new Error(`Failed to save project: ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Project saved successfully:", result.message); // Handle success message (e.g., show a notification)
    } catch (error) {
      console.error("Error saving project:", error);
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

      return projects.map(project => project.projectTitle); // Return project titles
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

      {/* Save Project button */}
      {selectedProject && (
        <div className="mt-4">
          <button
            onClick={saveProject}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            Save Project
          </button>
        </div>
      )}

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
