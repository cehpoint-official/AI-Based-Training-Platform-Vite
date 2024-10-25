import { useState } from 'react';
import { Spinner, Table, Button } from 'flowbite-react';
import React from 'react';

const UserTable = ({ datas, loading, projects = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null); // State to manage which user's projects are being viewed
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  // Helper function to check if the user has any associated projects
  const hasProject = (userId) => {
    return projects?.length && projects.some((project) => project.userId === userId);
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

  return (
    <div className="flex flex-col py-4">
      <div className="overflow-x-auto">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            <Table.HeadCell className="font-black">Type</Table.HeadCell>
            <Table.HeadCell className="font-black">ID</Table.HeadCell>
            <Table.HeadCell className="font-black">Projects</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {datas?.map((user) => (
              <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black">
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
                {/* Check if the user has projects, display "Project" button or "No Project" */}
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {hasProject(user._id) ? (
                    <Button
                      color="blue"
                      onClick={() => handleOpenModal(user._id)} // Open modal with user projects
                    >
                      Project
                    </Button>
                  ) : (
                    'No Project'
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modal for showing project details */}
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
                    <p className="text-lg font-semibold">Title: {project.title}</p>
                    <p className="text-sm text-gray-600">Email: {project.email}</p>
                    <p className="text-sm text-gray-600">
                      Completed:{" "}
                      <span
                        className={`font-bold ${project.completed ? "text-green-500" : "text-red-500"}`}
                      >
                        {project.completed ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      GitHub URL:{" "}
                      {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          {project.github_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Date Created: {new Date(project.dateCreated).toLocaleDateString()}</p>

                    {/* Send Email button */}
                    <Button
                      onClick={() => handleSendEmail(project)}
                      className={`mt-2 ${project.completed ? "bg-green-500" : "bg-red-500"} text-white`}
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
