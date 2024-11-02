import { useEffect, useState } from "react";
import { Spinner, Table, Button } from "flowbite-react";
import React from "react";
import axiosInstance from "../../axios";
import UserTableProjectDetails from "./userTableProjectDetails";

const UserTable = ({ datas=[], loading, projects = [] }) => {
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
      setCompletedUsers(completedProjects.map((project) => project.userId));

      // Store user IDs with any projects
      const allUserIdsWithProjects = projects.map((project) => project.userId);
      setUsersWithProjects([...new Set(allUserIdsWithProjects)]);
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
  const filteredUsers = datas?.filter((user) => {
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
        <UserTableProjectDetails
          selectedUser={selectedUser}
          getUserProjects={getUserProjects}
          handleCloseModal={handleCloseModal}
          calculateTimeLeft={calculateTimeLeft}
          handleSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
};

export default UserTable;
