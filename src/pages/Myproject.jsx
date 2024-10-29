import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Header from "../components/header";
import Footers from "../components/footers";
import axiosInstance from "../axios";

const MyProject = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showCompleteModal, setShowCompleteModal] = useState(null); // For Mark as Complete
  const [showGithubModal, setShowGithubModal] = useState(null); // For Save GitHub URL
  const [githubUrl, setGithubUrl] = useState("");

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
      const response = await axiosInstance.get(`/api/getmyprojects`);
      const filteredProjects = response.data.data.filter(
        (project) => project.firebaseUId === uid
      );
      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleMarkAsComplete = (projectId) => {
    setShowCompleteModal(projectId);
  };

  const handleSaveGithubUrl = (projectId) => {
    setShowGithubModal(projectId);
  };

  const confirmCompleteProject = async (projectId) => {
    try {
      await axiosInstance.post("/api/updateuserproject", {
        projectId,
        completed: true,
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, completed: true } : project
        )
      );
      setShowCompleteModal(null);
    } catch (error) {
      console.error("Error marking project as complete:", error);
    }
  };

  const confirmSaveGithubUrl = async (projectId) => {
    try {
      await axiosInstance.post("/api/updateuserproject", {
        projectId,
        github_url: githubUrl,
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, github_url: githubUrl } : project
        )
      );
      setShowGithubModal(null);
    } catch (error) {
      console.error("Error saving GitHub URL:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1 dark:text-white p-4">
        <h2 className="text-lg font-bold mb-4">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-gray-600">Email: {project.email}</p>
                <p className="text-gray-600">Date Created: {new Date(project.dateCreated).toLocaleDateString()}</p>
                <p className="text-gray-600">Completed: {project.completed ? "Yes" : "No"}</p>
                <p className="text-gray-600">
                  GitHub:{" "}
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {project.github_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <div className="flex space-x-4 mt-4">
                  {!project.completed && (
                    <>
                      <button
                        onClick={() => handleMarkAsComplete(project._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Mark as Complete
                      </button>
                      <button
                        onClick={() => handleSaveGithubUrl(project._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {project.github_url ? "Edit GitHub URL" : "Save GitHub URL"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />

      {/* Mark as Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg flex items-center justify-center flex-col">
            <h2 className="text-red-500 text-3xl mb-4">Are you sure ?</h2>
            <p className="mb-4 w-80 text-center text-black dark:text-white">
              After marking this project as complete, you won't be able to change it or push updates to the GitHub repository. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowCompleteModal(null)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={() => confirmCompleteProject(showCompleteModal)}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save GitHub URL Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-80 dark:bg-zinc-900 p-4 rounded-lg shadow-lg flex items-center justify-center flex-col">
            <p className="mb-4 text-2xl text-center text-black dark:text-white">Enter the GitHub URL for this project:</p>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="mb-4 p-2 w-full border rounded bg-white dark:bg-slate-700 placeholder:text-white/20 text-black/60 dark:text-white/60"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowGithubModal(null)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={() => confirmSaveGithubUrl(showGithubModal)}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProject;
