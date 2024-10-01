import { Table } from 'flowbite-react';
import React from 'react';

const UserTable = ({ datas }) => {

    return (
        <div className='flex flex-col py-4'>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Head className='border-b text-black'>
                        <Table.HeadCell className='font-black'>Email</Table.HeadCell>
                        <Table.HeadCell className='font-black'>Name</Table.HeadCell>
                        <Table.HeadCell className='font-black'>Type</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {datas.map(user => (
                            <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black">
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                                    {user.email}
                                </Table.Cell>
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white"> {user.mName}</Table.Cell>
                                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white"> {user.type}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>

    );
};

export default UserTable;
