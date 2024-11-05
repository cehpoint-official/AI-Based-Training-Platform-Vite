import React, { useState } from "react";
import { Table, Button } from "flowbite-react";
import { toast } from "react-toastify";
import axiosInstance from "@/axios";

const TestRecordTable = ({ data = [], resumes = [], reports = [] }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const mergedData = data.map((item) => {
    const resume = resumes.find((res) => res.uid === item.userId);
    return { ...item, resume }; // Add resume data to each item if available
  });
  const handleReportClick = async (uid) => {
    // Find the report for the clicked user
    const report = reports.find((rep) => rep.uid === uid);
    // console.log(data)
    if (report) {
      setSelectedReport(report);
    } else {
      showToast("Report not available for this user.");
    }
  };

  const showToast = (msg) => {
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

  return (
    <div className="flex flex-col py-4">
      <div className="overflow-x-auto">
        <Table>
          <Table.Head className="border-b text-black">
            <Table.HeadCell className="font-black">Email</Table.HeadCell>
            <Table.HeadCell className="font-black">Name</Table.HeadCell>
            <Table.HeadCell className="font-black">User ID</Table.HeadCell>
            <Table.HeadCell className="font-black">Resume</Table.HeadCell>
            <Table.HeadCell className="font-black">Recordings</Table.HeadCell>
            <Table.HeadCell className="font-black">Test Report</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {mergedData.map((item) => (
              <Table.Row
                key={item._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-black"
              >
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {item.userEmail}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {item.userName}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {item.userId}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  {item.resume ? (
                    <a
                      href={item.resume.resumeData.fileUrl}
                      className="underline text-blue-600 ml-1"
                      target="_black"
                    >
                      Resume
                    </a>
                  ) : (
                    "No Resume Available"
                  )}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  <a
                    href={item.recordings.face}
                    className="underline text-blue-600 mr-1"
                    target="_black"
                  >
                    Face
                  </a>
                  <a
                    href={item.recordings.screen}
                    className="underline text-blue-600 ml-1"
                    target="_black"
                  >
                    Screen
                  </a>
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-normal text-black dark:text-white">
                  <button onClick={() => handleReportClick(item.userId)}
                  className="border border-red-400 px-3 py-1 rounded-md font-semibold text-red-400 hover:bg-red-50"
                    >
                    See Report
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-[80%] h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Test Report for {selectedReport.name}
                </h3>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-red-500"
                >
                  Close
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedReport.email}
                </p>
                <p className="text-gray-700">
                  <strong>Feedback:</strong>{" "}
                  {selectedReport.reportData.feedback}
                </p>
              </div>

              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Suggestions
                </h4>
                <p className="text-gray-700">
                  {selectedReport.reportData.suggestions.join(", ")}
                </p>
              </div>

              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Expectations
                </h4>
                <ul className="text-gray-700">
                  <li>
                    <strong>Salary:</strong>{" "}
                    {selectedReport.reportData.expectations.salary}
                  </li>
                  <li>
                    <strong>Career Growth:</strong>{" "}
                    {selectedReport.reportData.expectations.careerGrowth}
                  </li>
                  <li>
                    <strong>Learning Opportunities:</strong>{" "}
                    {
                      selectedReport.reportData.expectations
                        .learningOpportunities
                    }
                  </li>
                </ul>
              </div>

              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  AI Analysis
                </h4>
                <ul className="text-gray-700">
                  <li>
                    <strong>Total Questions:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.totalQuestions}
                  </li>
                  <li>
                    <strong>Correct Answers:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.correctAnswers}
                  </li>
                  <li>
                    <strong>MCQ Correct:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.mcqCorrect}
                  </li>
                  <li>
                    <strong>Text Correct:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.textCorrect}
                  </li>
                  <li>
                    <strong>Score Percentage:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.scorePercentage}%
                  </li>
                  <li>
                    <strong>Employability Score:</strong>{" "}
                    {selectedReport.reportData.aiAnalysis.employabilityScore}
                  </li>
                </ul>
              </div>

              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Questions
                </h4>
                <ul className="text-gray-700 list-disc ml-5 space-y-1">
                  {selectedReport.reportData.questions.map((q, index) => (
                    <li key={index}>{q.question}</li>
                  ))}
                </ul>
              </div>

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRecordTable;
