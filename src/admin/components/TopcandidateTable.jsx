import { useEffect, useState } from "react";
import { Spinner, Table, Button } from "flowbite-react";
import React from "react";
import axiosInstance from "../../axios";


const TopcandidateTable = ({ datas = [], loading }) => {

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  return (
    <div className="flex flex-col py-4 relative">
      <div className="overflow-x-auto relative">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Serial</Table.HeadCell>
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            {/* <Table.HeadCell className="font-black">Type</Table.HeadCell> */}
            <Table.HeadCell className="font-black">ID</Table.HeadCell>
            <Table.HeadCell className="font-black">Projects</Table.HeadCell>

            <Table.HeadCell className="font-black">Courses</Table.HeadCell>
            <Table.HeadCell className="font-black">Quiz Score</Table.HeadCell>
            <Table.HeadCell className="font-black">Average Progress</Table.HeadCell>
            <Table.HeadCell className="font-black">Test Score</Table.HeadCell>
            <Table.HeadCell className="font-black">Total Point</Table.HeadCell>
            {/* <Table.HeadCell className="font-black">Action</Table.HeadCell> */}
          </Table.Head>
          <Table.Body className="divide-y">
            {datas?.map((data, index) => (
              <Table.Row
                key={data.uid}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
              >
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.email}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.mName}
                </Table.Cell>
                {/* <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.type}
                </Table.Cell> */}
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.uid}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.performanceScore.projectCount}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.performanceScore.courseCount}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.performanceScore.quizScoreAvg}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.performanceScore.averageProgress.toFixed(2) || 0.00}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.testScore || 0}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {data.points.toFixed(2) || 0.00}
                </Table.Cell>
                {/* <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  <button>Send Email</button>
                </Table.Cell> */}

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

    </div>
  );
};

export default TopcandidateTable;
