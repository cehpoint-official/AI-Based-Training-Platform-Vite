import { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "flowbite-react";

const ProjectDetails = ({ ids, selectedTitle }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // State to track the expanded user ID

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axiosInstance.get(`/api/getprojectsAdmin`);
        console.log(response.data.data);
        
        // Filter projects by userId and selectedTitle
        const filteredProjects = response.data.data.filter(project => 
          ids.includes(project.userId) && project.title === selectedTitle
        );
        
        setProjects(filteredProjects); // Set the filtered projects
        setLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false); // Update loading state in case of error
      }
    }

    fetchProjects();
  }, [ids, selectedTitle]); // Add selectedTitle to the dependency array

  const handleSendEmail = (project) => {
    alert(`Sending email about project "${project.title}" to ${project.email}`);
    // Logic to send email (could be implemented via API call)
  };

  // Render loading state or the filtered projects
  if (loading) {
    return <div>Loading...</div>;
  }

  const toggleDetails = (userId) => {
    setExpandedId(expandedId === userId ? null : userId); // Toggle the expanded state
  };

  return (
    <div className="">
      {projects.length > 0 ? (
        projects.map(project => (
          <div key={project._id} className="border-b border-gray-300 mb-2">
            <div 
              onClick={() => toggleDetails(project.userId)} // Handle click to toggle details
              className="cursor-pointer font-bold text-blue-600"
            >
              User ID: {project.userId}
            </div>
            {expandedId === project.userId && ( // Check if this user ID is expanded
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
            )}
          </div>
        ))
      ) : (
        <p>No projects found for the given IDs and title.</p>
      )}
    </div>
  );
}

export default ProjectDetails;
