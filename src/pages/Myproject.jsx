import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../components/header";
import Footers from "../components/footers";
import axiosInstance from "../axios";
import axios from 'axios';
import found from "@/assets/found.svg";

const MyProject = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showCompleteModal, setShowCompleteModal] = useState(null); // For Mark as Complete
  const [showGithubModal, setShowGithubModal] = useState(null); // For Save GitHub URL
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [openDescription, setOpenDescription] = useState(false);
  const [projectDesc, setProjectDesc] = useState(null);
  const [showForceModal, setShowForceModal] = useState(false); // For Force Take Project

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProjects(currentUser.uid); // Fetch projects based on firebaseUId
      } else {
        setUser(null);
        setProjects([]); // Clear projects if no user
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProjects = async (uid) => {
    try {
      const response = await axiosInstance.get("api/getmyprojects");
      const filteredProjects = response.data.data.filter(
        (project) => project.firebaseUId === uid
      );
      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleForceTakeProject = () => {
    setShowForceModal(true);
  };

  const confirmForceTakeProject = async () => {
    try {
      const newFirebaseUId = user.uid;
      const projectId = projectDesc; // Get the project ID
      const response = await axios.post('api/project/forceTake', {
        projectId,
        newFirebaseUId,
      });

      if (response.data.success) {
        console.log("Project forcefully assigned!");
        setShowForceModal(false);
        // Optionally, update the projects list locally after force assignment
        await fetchProjects(user.uid);
      } else {
        console.error("Failed to force assign project:", response.data.message);
      }
    } catch (error) {
      console.error("Error force assigning project:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1 dark:text-white p-4">
        <h2 className="text-lg font-bold mb-4 w-screen text-center">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md transition hover:bg-gray-300 dark:hover:bg-gray-800/90 transform ease-in-out duration-300 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg text-white ${
                    {
                      accepted: "bg-green-500",
                      rejected: "bg-red-500",
                      pending: "bg-yellow-500",
                    }[project.approve]
                  }`}>
                    {project.approve}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Created on: {new Date(project.dateCreated).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium mr-1">Description:</span>
                      <button onClick={() => setProjectDesc(project.description)} className="text-blue-500 hover:underline">Show Description</button>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Status:</span> {project.completed ? "Completed" : "In Progress"}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">GitHub:</span> {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Repository</a> : <span className="text-gray-400">N/A</span>}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Video Presentation:</span> {project.video_url ? <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch Video</a> : <span className="text-gray-400">N/A</span>}</p>
                    </div>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center h-center flex flex-col items-center justify-center w-screen">
              <img alt="img" src={found} className="max-w-sm h-3/6" />
              <p className="text-black font-black dark:text-white text-xl">
                Nothing Found
              </p>
              <button
                onClick={handleForceTakeProject}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Force Take Project
              </button>
            </div>
          )}
        </div>
      </div>

      {showForceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-white-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Warning</h3>
            <p>You're not qualified, but you can take this project forcefully. Are you sure?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={confirmForceTakeProject}
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowForceModal(false)}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Footers />
    </div>
  );
};

export default MyProject;
