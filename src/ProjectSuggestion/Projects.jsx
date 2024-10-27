import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axiosInstance from "../axios";

const Projects = ({ courseTitle }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [projectPages, setProjectPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user) {
      const emailFromGoogle = user.providerData[0]?.email;
      setUserEmail(emailFromGoogle || user.email || "");
    } else {
      setUserEmail("");
    }
  }, [user]);

  // Fetch user ID based on email
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosInstance.get(`/api/getusers`);
        const foundUser = response.data.find(user => user.email === userEmail);
        if (foundUser) {
          setUserId(foundUser._id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userEmail) {
      fetchUser();
    }
  }, [userEmail]);

  // Fetch projects from your API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/getmainprojects`);
        const projects = response.data.data || [];
        setProjectPages(projects); // Store the fetched projects directly
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
      alert("Project saved successfully")
      console.log("Project saved successfully:", result.message); // Handle success message (e.g., show a notification)
  
      // Update the project to add userId to assignedTo array
      await updateProjectAssignedTo(selectedProject, userId);
  
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const updateProjectAssignedTo = async (projectTitle, userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/updateproject', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectTitle: projectTitle,
          userId: userId, // Add user ID to the assignedTo array
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update project:", errorText);
        throw new Error(`Failed to update project: ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Project updated successfully:", result.message);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Handle project selection
  const handleProjectSelection = (project) => {
    setSelectedProject(project.title); // Assuming project is an object with a 'title' field
  };

  // Handle the Next button click
  const handleNext = () => {
    if (currentPage < projectPages.length - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle the Prev button click
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="bg-white p-4">
      <h2 className="text-2xl font-bold mb-4">Project Suggestions for {courseTitle}</h2>

      {loading && <p>Loading project suggestions...</p>}

      {!loading && projectPages.length > 0 && (
        <ul className="mb-4">
          {projectPages.map((project, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 mb-2 border ${
                selectedProject === project.title ? "bg-green-200" : "bg-gray-100"
              }`}
              onClick={() => handleProjectSelection(project)}
            >
              {project.title} {/* Assuming the project has a 'title' property */}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={handlePrev} disabled={currentPage === 0} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200">
          Prev
        </button>
        <button onClick={handleNext} disabled={loading || currentPage === projectPages.length - 1} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200">
          Next
        </button>
      </div>

      {selectedProject && (
        <div className="mt-4">
          <button onClick={saveProject} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
            Save Project
          </button>
          <h3 className="text-xl font-semibold mt-2">Selected Project:</h3>
          <p>{selectedProject}</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
