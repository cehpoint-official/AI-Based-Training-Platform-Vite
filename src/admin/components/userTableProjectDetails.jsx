import { Button, Table } from "flowbite-react"

const UserTableProjectDetails = ({ 
    selectedUser, 
    getUserProjects, 
    handleCloseModal, 
    calculateTimeLeft, 
    handleSendEmail 
  }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-md relative w-[90%] max-h-[80vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-xl font-bold"
            onClick={handleCloseModal}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-6">Project Details</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <Table.Head className="border-b text-black">
                <Table.HeadCell className="font-black">Title</Table.HeadCell>
                <Table.HeadCell className="font-black">Email</Table.HeadCell>
                <Table.HeadCell className="font-black">Created Date</Table.HeadCell>
                <Table.HeadCell className="font-black">Time Frame</Table.HeadCell>
                <Table.HeadCell className="font-black">Time Left</Table.HeadCell>
                <Table.HeadCell className="font-black">Status</Table.HeadCell>
                <Table.HeadCell className="font-black">GitHub</Table.HeadCell>
                <Table.HeadCell className="font-black">Video</Table.HeadCell>
                <Table.HeadCell className="font-black">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {getUserProjects(selectedUser).map((project) => (
                  <Table.Row
                    key={project._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
                  >
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {project.title}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {project.email}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {new Date(project.dateCreated).toLocaleDateString()}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {project.time}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {calculateTimeLeft(project.dateCreated, parseInt(project.time))}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          project.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {project.completed ? "Completed" : "In Progress"}
                      </span>
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {project.github_url ? (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      {project.video_url ? (
                        <a
                          href={project.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Watch
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                    
                    <Table.Cell className="whitespace-normal font-normal text-black">
                      <Button
                        onClick={() => handleSendEmail(project)}
                        className={`${
                          project.completed ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                        size="sm"
                      >
                        Send Email
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
  )
}
export default UserTableProjectDetails