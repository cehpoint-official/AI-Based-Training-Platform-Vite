import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../components/header";
import Footers from "../components/footers";
import axiosInstance from "../axios";

const MyProject = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null); // New modal for adding GitHub and video URLs
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [openDescription, setOpenDescription] = useState(false);
  const [projectDesc, setProjectDesc] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProjects(currentUser.uid);
      } else {
        setUser(null);
        setProjects([]);
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

  const handleMarkAsComplete = (projectId) => setShowCompleteModal(projectId);
  const handleOpenAddModal = (projectId) => setShowAddModal(projectId); // Handler for Add form modal

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

  const confirmSaveUrls = async (projectId) => {
    try {
      await axiosInstance.post("/api/updateuserproject", {
        projectId,
        github_url: githubUrl,
        video_url: videoUrl,
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, github_url: githubUrl, video_url: videoUrl }
            : project
        )
      );
      setShowAddModal(null);
    } catch (error) {
      console.error("Error saving URLs:", error);
    }
  };

  const calculateTimeLeft = (dateCreated, duration) => {
    const createdDate = new Date(dateCreated);
    const dueDate = new Date(
      createdDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000
    ); // duration in weeks
    const today = new Date();
    const timeLeft = dueDate - today;

    if (timeLeft <= 0) {
      return "Time's up!";
    }

    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
  };

  const showDesc = (desc) => {
    setOpenDescription(true);
    setProjectDesc(desc);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1 dark:text-white p-4">
        <h2 className="text-lg font-bold mb-4">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md transition hover:bg-gray-300 dark:hover:bg-gray-800/90 transform ease-in-out duration-300 relative "
              >
                <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {project.title}
                      </h3>
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-lg text-white ${
                          {
                            accepted: "bg-green-500",
                            rejected: "bg-red-500",
                            pending: "bg-yellow-500",
                          }[project.approve]
                        }`}
                      >
                        {project.approve}
                      </span>
                    </div>
                <div className="flex items-center justify-between">
                  <span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Created on:{" "}
                      {new Date(project.dateCreated).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium mr-1">Description:</span>
                      <button
                        onClick={() => showDesc(project.description)}
                        className="text-blue-500 hover:underline"
                      >
                        Show Description
                      </button>
                    </p>

                    {/* <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Time:</span> {project.time}
                  </p> */}

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Status:</span>{" "}
                      {project.completed ? "Completed" : "In Progress"}
                    </p>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">GitHub:</span>{" "}
                        {project.github_url ? (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Repository
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Video Presentation:</span>{" "}
                        {project.video_url ? (
                          <a
                            href={project.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Watch Video
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </p>
                    </div>
                  </span>

                  <span className="flex items-center justify-center">
                    <div className="relative rounded-full bg-gray-300 dark:bg-gray-700 h-20 w-20 flex flex-col items-center justify-center p-2 shadow-md border-2 border-gray-400 dark:border-gray-600">
                      {(() => {
                        const timeLeft = calculateTimeLeft(
                          project.dateCreated,
                          parseInt(project.time)
                        );
                        if (timeLeft === "Time's up!") {
                          return (
                            <div className="text-red-500 text-center font-semibold">
                              <p className="text-sm">Time's</p>
                              <p className="text-sm">up!</p>
                            </div>
                          );
                        }
                        const days = timeLeft.split(" ")[0]; // Get the number
                        return (
                          <>
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {days}
                            </span>
                            <span className="text-[0.65rem] text-gray-600 dark:text-gray-300">
                              days left
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </span>
                </div>

                <div className="flex space-x-4 mt-6 justify-center">
                  {!project.completed && (
                    <>
                      <button
                        onClick={() => handleMarkAsComplete(project._id)}
                        className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => handleOpenAddModal(project._id)}
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      >
                        Add Details
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

      {openDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setOpenDescription(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Project Description
            </h3>
            <div className="text-gray-600 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
              {projectDesc ? (
                projectDesc
                  .split(/\n{2,}/) // Split on two or more newlines for paragraphs
                  .filter((para) => para.trim() !== "")
                  .map((paragraph, index) => (
                    <p
                      key={`para-${index}`}
                      className="mb-4 last:mb-0 leading-relaxed"
                    >
                      {paragraph.split("\n").map((line, lineIndex) => (
                        <React.Fragment key={`line-${index}-${lineIndex}`}>
                          {line}
                          {lineIndex < paragraph.split("\n").length - 1 && (
                            <br />
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  ))
              ) : (
                <p className="text-gray-500 italic">
                  No description available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footers className="sticky bottom-0 z-50" />

      {/* Mark as Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex items-center justify-center flex-col">
            <h2 className="text-red-500 text-3xl mb-6">Are you sure?</h2>
            <p className=" w-80 text-center text-black dark:text-white leading-5 mb-8">
              After marking this project as complete, you won't be able to
              change it or push updates to the GitHub repository. Are you sure
              you want to proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCompleteModal(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
              >
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

      {/* Add URLs Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[40vw] dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
              Enter Project Details
            </h1>
            <div className="bg-black/20 dark:bg-white/20 h-[1px] w-full mt-3 mb-2"></div>
            <em className="text-start text-[0.9rem] text-gray-600 dark:text-gray-300 tracking-tight leading-5">
              <strong>Note:</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li className="ml-5 -indent-4">
                  Include a <strong>GitHub link</strong> to showcase your
                  repository and help others explore your code.
                </li>
                <li className="ml-5 -indent-4">
                  Provide a <strong>video presentation</strong> link for a
                  visual overview of your project.
                </li>
                <li className="ml-5 -indent-4">
                  Ensure your GitHub <strong>README</strong> is detailed (with
                  setup steps, features, screenshots, and usage) for better
                  understanding.
                </li>
              </ul>
            </em>

            <div className="bg-black/20 dark:bg-white/20 h-[1px] w-full mb-4 mt-2"></div>

            <div className="w-full">
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                GitHub Repository URL
              </label>
              <input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="mb-4 p-2 w-full border rounded bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Presentation Video URL (Optional)
              </label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="mb-6 p-2 w-full border rounded bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end w-full space-x-4">
              <button
                onClick={() => setShowAddModal(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmSaveUrls(showAddModal)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProject;
