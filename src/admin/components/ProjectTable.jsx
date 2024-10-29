import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  Spinner,
} from "flowbite-react";
import React from "react";
import axios from "axios"; // Assuming axios is installed
import axiosInstance from "../../axios";
import ProjectDetails from "./ProjectDetails";

const ProjectTable = ({ projects = [], loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    difficulty: "",
    time: "",
  });
  const [projectDetails, setProjectDetails] = useState(null); // Change to single project details
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // For the modal that shows project details
  const [showIds, setShowIds] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to handle input changes
  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Function to handle saving the project
  const handleSaveProject = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saveProject`,
        newProject
      );
      alert(response.data.message);
      setIsModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setProjectDetails(null); // Reset project details
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  return (
    <div className="flex flex-col py-4">
      <Button
        className="bg-red-500 px-4 py-2 rounded-lg mx-auto mb-10"
        onClick={() => setIsModalOpen(true)}
      >
        ADD Project
      </Button>

      {/* Table displaying projects */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Title</Table.HeadCell>
            <Table.HeadCell className="font-black">Category</Table.HeadCell>
            <Table.HeadCell className="font-black">Difficulty</Table.HeadCell>
            <Table.HeadCell className="font-black">Time</Table.HeadCell>
            <Table.HeadCell className="font-black">Assigned to</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {projects.map((project) => (
              <Table.Row
                key={project._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
              >
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.title}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.category}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.difficulty}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {project.time}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white flex items-center justify-start gap-x-3">
                  <p>{project.assignedTo.length}</p>
                  <button
                    onClick={() => {
                        setSelectedItem(project.assignedTo); // Store assigned IDs
                        console.log(project.assignedTo)
                        setShowIds(true);
                      }}
                    className="bg-gray-500 p-1 rounded-md"
                  >
                    👁️
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modal to Add New Project */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Project</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              name="title"
              placeholder="Project Title"
              value={newProject.title}
              onChange={handleInputChange}
            />
            <TextInput
              name="category"
              placeholder="Category (e.g., Web, Android, ML)"
              value={newProject.category}
              onChange={handleInputChange}
            />
            <Textarea
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleInputChange}
            />
            <TextInput
              name="difficulty"
              placeholder="Difficulty (e.g., Beginner, Intermediate, Advanced)"
              value={newProject.difficulty}
              onChange={handleInputChange}
            />
            <TextInput
              name="time"
              placeholder="Estimated Time (e.g., 1 week, 2 weeks)"
              value={newProject.time}
              onChange={handleInputChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveProject}>Save Project</Button>
        </Modal.Footer>
      </Modal>

      {showIds && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[40vw]">
            <h2 className="font-bold text-lg">Assigned User IDs</h2>
            {selectedItem.map((item, index) => (
              <ProjectDetails ids={item.userid} key={index} selectedTitle={item.title} />
            ))}
            <button
              onClick={() => setShowIds(false)} // Close the modal
              className="mt-2 bg-red-500 text-white rounded-md p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
