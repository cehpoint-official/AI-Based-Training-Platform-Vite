import { Spinner, Table } from "flowbite-react";
import React from "react";
import NothingFound from "@/components/nothingfound";

const CourseTable = ({ datas, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color='gray' />
      </div>
    );
  }
  return (
    <div className="flex flex-col py-4">
      {datas.length === 0 ? (
        <div className="flex items-center justify-center">
          <NothingFound />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head className="border-b text-black">
              <Table.HeadCell className="font-black">Title</Table.HeadCell>
              <Table.HeadCell className="font-black">Type</Table.HeadCell>
              <Table.HeadCell className="font-black">UserId</Table.HeadCell>
              <Table.HeadCell className="font-black">Progress</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {datas.map((courses) => (
                <Table.Row
                  key={courses._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
                >
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {courses.mainTopic}
                  </Table.Cell>
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {" "}
                    {courses.type}
                  </Table.Cell>
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {" "}
                    {courses.user}
                  </Table.Cell>

                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {" "}
                    {courses.progress || 0}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
