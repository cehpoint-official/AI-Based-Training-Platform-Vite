import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button, Spinner, Table } from "flowbite-react";

const ProjectDetails = ({ ids, selectedTitle }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axiosInstance.get(`/api/getprojectsAdmin`);

        // Filter projects based on user IDs and title
        const filteredProjects = response.data.data.filter(
          (project) =>
            ids?.includes(project.userId) && project.title === selectedTitle
        );

        // Fetch user details for each project
        const projectsWithUserData = await Promise.all(
          filteredProjects.map(async (project) => {
            const userResponse = await axiosInstance.get(
              `/api/user/getUserByID?id=${project.userId}`
            );

            // Return the project along with user data or null if not found
            return {
              ...project,
              userData: userResponse.data.success
                ? userResponse.data.userData
                : null,
            };
          })
        );

        // Log the projects with user data for debugging
        // console.log("Projects with User Data:", projectsWithUserData);

        // Update state with projects and their corresponding user data
        setProjects(projectsWithUserData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    }

    fetchProjects();
  }, [ids, selectedTitle]);

  const handleSendEmail = (project) => {
    alert(`Sending email about project "${project.title}" to ${project.email}`);
  };

  const handleApprove = async (projectId, email) => {
    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/api/project/approve`,
        { projectId, userEmail: email }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, approve: "accepted" }
            : project
        )
      );
      alert(`Approval email sent to ${email}`);
    } catch (error) {
      console.error("Error approving project:", error);
      alert("Failed to approve project");
    }
  };

  const handleReject = async (projectId, email) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return; // If no reason is provided, do not proceed

    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/api/project/reject`,
        { projectId, userEmail: email, reason }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, approve: "rejected" }
            : project
        )
      );
      alert(`Rejection email sent to ${email}`);
    } catch (error) {
      console.error("Error rejecting project:", error);
      alert("Failed to reject project");
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
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} `;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-x-auto overflow-y-hidden">
      {projects.length > 0 ? (
        <Table className="mt-4">
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">User ID</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Status</Table.HeadCell>
            <Table.HeadCell className="font-black">Time Left</Table.HeadCell>
            <Table.HeadCell className="font-black">Submitted</Table.HeadCell>
            <Table.HeadCell className="font-black">GitHub URL</Table.HeadCell>
            <Table.HeadCell className="font-black">Video URL</Table.HeadCell>
            <Table.HeadCell className="font-black">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {projects.map((project) => (
              <Table.Row
                key={project._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
              >
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.userId}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.userData.mName || "N/A"}{" "}
                  {/* Assuming name is in the project object */}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.email || "N/A"}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  <span
                    className={`font-bold ${
                      project.approve === "accepted"
                        ? "text-green-500"
                        : project.approve === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {project.approve}
                  </span>
                </Table.Cell>

                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                {calculateTimeLeft(project.dateCreated, parseInt(project.time))}
                </Table.Cell>

                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  <span
                   className={`px-2 py-1 rounded-full text-xs font-bold ${
                    project.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                  >
                    {project.completed ? "Yes" : "No"}
                  </span>
                </Table.Cell>
                
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.video_url ? (
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Video
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Table.Cell>

                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white flex space-x-2">
                  <Button
                    color="green"
                    onClick={() => handleApprove(project._id, project.email)}
                  >
                    Accept
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleReject(project._id, project.email)}
                  >
                    Reject
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-gray-600">
          No projects found for the given IDs and title.
        </p>
      )}
    </div>
  );
};

export default ProjectDetails;
