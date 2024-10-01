import axios from 'axios';
import { Table } from 'flowbite-react';
import React from 'react';
import { toast } from 'react-toastify';
import { serverURL } from '../../constants';

const AdminTable = ({ admin, user }) => {

    async function removeAdmin(email) {
        const postURL = serverURL + '/api/removeadmin';
        const response = await axios.post(postURL, { email });
        if (response.data.success) {
            showToast(response.data.message);
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
            progress: undefined
        });
        window.location.reload();
    }

    async function addAdmin(email) {
        const postURL = serverURL + '/api/addadmin';
        const response = await axios.post(postURL, { email });
        if (response.data.success) {
            showToast(response.data.message);
        }
    }

    return (
        <div className='flex flex-col py-4'>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Head className='border-b text-black'>
                        <Table.HeadCell className='font-black'>Email</Table.HeadCell>
                        <Table.HeadCell className='font-black'>Name</Table.HeadCell>
                        <Table.HeadCell className='font-black'>Edit</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {admin.map(user => (
                            <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black">
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                                    {user.email}
                                </Table.Cell>
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white"> {user.mName}</Table.Cell>
                                {user.type === 'no' ?
                                    <Table.Cell onClick={() => removeAdmin(user.email)} className="whitespace-normal font-normal text-blue-800 dark:text-blue-800">Remove Admin</Table.Cell>
                                    :
                                    <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">Main Admin</Table.Cell>
                                }
                            </Table.Row>
                        ))}
                        {user.map(user => (
                            <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black">
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                                    {user.email}
                                </Table.Cell>
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white"> {user.mName}</Table.Cell>
                                <Table.Cell onClick={() => addAdmin(user.email)} className="whitespace-normal font-normal text-blue-800 dark:text-blue-800">Add Admin</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>

    );
};

export default AdminTable;
