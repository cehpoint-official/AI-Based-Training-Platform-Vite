import { useEffect, useState } from "react";
import { Spinner, Table, Button } from "flowbite-react";
import React from "react";
import axiosInstance from "../../axios";

const UserTable = ({ datas, loading, projects = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null); // State to manage which user's projects are being viewed
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [completedUsers, setCompletedUsers] = useState([]); // State to store users with completed projects
  const [usersWithProjects, setUsersWithProjects] = useState([]); // State to store users with any projects
  const [filter, setFilter] = useState("all"); // State to manage which filter is applied

  // Function to fetch projects and filter completed ones
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/api/getmyprojects`);
      const projects = response.data.data;

      // Filter projects where completed is true
      const completedProjects = projects.filter(
        (project) => project.completed === true
      );
      setCompletedUsers(completedProjects.map((project) => project.userId)); // Store user IDs with completed projects

      // Store user IDs with any projects
      const allUserIdsWithProjects = projects.map((project) => project.userId);
      setUsersWithProjects([...new Set(allUserIdsWithProjects)]); // Store unique user IDs
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to change filter state
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  // Helper function to check if the user has any associated projects
  const hasProject = (userId) => {
    return (
      projects?.length && projects.some((project) => project.userId === userId)
    );
  };

  // Function to handle opening the modal with user-specific projects
  const handleOpenModal = (userId) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Function to get projects for a specific user
  const getUserProjects = (userId) => {
    return projects.filter((project) => project.userId === userId);
  };

  // Function to handle sending email (dummy implementation)
  const handleSendEmail = (project) => {
    alert(`Sending email about project "${project.title}" to ${project.email}`);
    // Logic to send email (could be implemented via API call)
  };

  // Filter users based on the selected filter
  const filteredUsers = datas.filter((user) => {
    if (filter === "completed") {
      return completedUsers.includes(user._id);
    }
    if (filter === "projects") {
      return usersWithProjects.includes(user._id);
    }
    return true; // Default: show all users
  });

  return (
    <div className="flex flex-col py-4 relative">
      <div className="px-4 flex items-center justify-between w-[97%] mb-4 bg-zinc-300 mx-auto py-4 rounded-lg max-md:flex-col max-md:gap-y-3">
        <h3 className="text-3xl font-bold uppercase">Filter</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => changeFilter("all")}
            className={`px-4 py-2 rounded-md text-white ${
              filter === "all" ? "bg-black" : "bg-black/70"
            }`}
          >
            Show All Users
          </button>
          <button
            onClick={() => changeFilter("completed")}
            className={`px-4 py-2 rounded-md text-white ${
              filter === "completed" ? "bg-black" : "bg-black/70"
            }`}
          >
            Project Completed
          </button>
          <button
            onClick={() => changeFilter("projects")}
            className={`px-4 py-2 rounded-md text-white ${
              filter === "projects" ? "bg-black" : "bg-black/70"
            }`}
          >
            Users with Projects
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-black"></div>
      <div className="overflow-x-auto relative">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            <Table.HeadCell className="font-black">Type</Table.HeadCell>
            <Table.HeadCell className="font-black">ID</Table.HeadCell>
            <Table.HeadCell className="font-black">Projects</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredUsers?.map((user) => (
              <Table.Row
                key={user._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
              >
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {user.email}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {user.mName}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {user.type}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {user._id}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {hasProject(user._id) ? (
                    <Button
                      className="bg-black"
                      onClick={() => handleOpenModal(user._id)}
                    >
                      Project
                    </Button>
                  ) : (
                    "No Project"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md relative w-1/2">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <div className="flex flex-col">
              {getUserProjects(selectedUser).length > 0 ? (
                getUserProjects(selectedUser).map((project) => (
                  <div key={project._id} className="border-b py-2">
                    <p className="text-lg font-semibold">
                      Title: {project.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {project.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed:{" "}
                      <span
                        className={`font-bold ${
                          project.completed ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {project.completed ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      GitHub URL:{" "}
                      {project.github_url ? (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          {project.github_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date Created:{" "}
                      {new Date(project.dateCreated).toLocaleDateString()}
                    </p>

                    {/* Send Email button */}
                    <Button
                      onClick={() => handleSendEmail(project)}
                      className={`mt-2 ${
                        project.completed ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      Send Email
                    </Button>
                  </div>
                ))
              ) : (
                <p>No projects found for this user.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
