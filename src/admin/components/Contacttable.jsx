import { Table } from "flowbite-react";
import React from "react";
import NothingFound from "@/components/nothingfound";

const ContactTable = ({ datas }) => {
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
              <Table.HeadCell className="font-black">Name</Table.HeadCell>
              <Table.HeadCell className="font-black">Email</Table.HeadCell>
              <Table.HeadCell className="font-black">Message</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {datas.map((contact) => (
                <Table.Row
                  key={contact._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
                >
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {contact.fname} {contact.lname}
                  </Table.Cell>
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {" "}
                    {contact.email} <br />
                    {contact.phone}
                  </Table.Cell>
                  <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                    {" "}
                    {contact.msg}
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

export default ContactTable;
