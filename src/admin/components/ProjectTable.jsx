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
import { IoClose, IoEye } from "react-icons/io5";

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
  const [openDescription, setOpenDescription] = useState(false);
  const [projectDesc, setProjectDesc] = useState(null);

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

  const showDesc = (desc) => {
    setOpenDescription(true);
    setProjectDesc(desc);
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
            <Table.HeadCell className="font-black">Descriptopn</Table.HeadCell>
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
                  <button
                    onClick={() => showDesc(project.description)}
                    className="text-blue-500 hover:underline"
                  >
                    Show Description
                  </button>
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
                  <button
                    onClick={() => {
                      setSelectedItem(project.assignedTo);
                      console.log(project.assignedTo);
                      setShowIds(true);
                    }}
                    className="bg-black text-white p-1 rounded-md flex items-center justify-center w-[5rem] gap-x-3"
                  >
                    <p className="font-bold">{project.assignedTo.length}</p>
                    <IoEye size={20} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] relative overflow-hidden ">
            <h2 className="font-bold text-lg">Assigned User IDs</h2>
            {selectedItem.map((item, index) => (
              <ProjectDetails
                ids={item.userid}
                key={index}
                selectedTitle={item.title}
              />
            ))}
            <button
              onClick={() => setShowIds(false)} // Close the modal
              className="bg-red-600 text-white rounded-es-md p-2 absolute right-0 top-0"
            >
              <IoClose size={23} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
