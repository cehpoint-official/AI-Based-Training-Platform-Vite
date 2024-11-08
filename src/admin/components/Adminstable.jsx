import { Table, Button } from "flowbite-react";
import React from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/axios";

const AdminTable = ({ admin = [], user = [] }) => {
  async function removeAdmin(email) {
    try {
      const postURL = "/api/removeadmin";
      const response = await axiosInstance.post(postURL, { email });
      if (response.data.success) {
        showToast(response.data.message);
      } else {
        console.error("Remove admin failed:", response.data.message);
        showToast("Failed to remove admin: " + response.data.message);
      }
    } catch (error) {
      console.error("Error removing admin:", error.response ? error.response.data : error.message);
      showToast("Error removing admin. Please try again.");
    }
  }

  const showToast = async (msg) => {
    toast(msg, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  async function addAdmin(email) {
    const postURL = "/api/addadmin";
    const response = await axiosInstance.post(postURL, { email });
    if (response.data.success) {
      showToast(response.data.message);
    }
  }

  return (
    <div className="flex flex-col py-4">
      <div className="overflow-x-auto">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            {/* <Table.HeadCell className="font-black">Status</Table.HeadCell> */}
            <Table.HeadCell className="font-black">Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {admin.map((user) => (
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
                {/* <Table.Cell className="whitespace-normal font-normal text-blue-800 dark:text-blue-800">
                  Admin
                </Table.Cell> */}
                <Table.Cell>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => removeAdmin(user.email)}
                  >
                    Remove
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {user.map((user) => (
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
                <Table.Cell className="whitespace-normal font-normal text-gray-500 dark:text-gray-400">
                  User
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    color="green"
                    onClick={() => addAdmin(user.email)}
                  >
                    Make Admin
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default AdminTable;