/* eslint-disable no-unused-vars */
import { Navbar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "./components/adminsidebar";
import AdminHead from "./components/adminhead";
import AdminSidebarMobile from "./components/adminsidebarmobile";
import DashboardCards from "./components/dashboardcards";
import axiosInstance from "../axios";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    sessionStorage.setItem("darkMode", false);
    async function dashboardData() {
      try {
        const postURL = `/api/dashboard`;
        const response = await axiosInstance.post(postURL);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }
    dashboardData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputSubmit = async () => {
    try{
      const postURL = `/api/key`;
      const response = await axiosInstance.post(postURL,{ key: inputValue });
      setInputValue('');
    }catch(error){
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <div className="flex bg-white dark:bg-black md:hidden pb-10 overflow-y-auto">
          <div
            className={`fixed inset-0 bg-black opacity-50 z-50 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
            onClick={toggleSidebar}
          ></div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div>
              <Navbar
                fluid
                className="py-3 dark:bg-black bg-white border-black dark:text-white dark:border-white md:border-b"
              >
                <Navbar.Brand className="ml-1">
                  <p className="font-black text-xl">Admin Panel</p>
                </Navbar.Brand>
                <div className="flex md:hidden justify-center items-center">
                  {isSidebarOpen ? (
                    <FiX
                      onClick={toggleSidebar}
                      className="mx-2"
                      size={20}
                      color={
                        sessionStorage.getItem("darkMode") === "true"
                          ? "white"
                          : "black"
                      }
                    />
                  ) : (
                    <FiMenu
                      onClick={toggleSidebar}
                      className="mx-2"
                      size={20}
                      color={
                        sessionStorage.getItem("darkMode") === "true"
                          ? "white"
                          : "black"
                      }
                    />
                  )}
                </div>
              </Navbar>
              <DashboardCards datas={data} />
            </div>
            <AdminSidebarMobile isSidebarOpen={isSidebarOpen} />
          </div>
        </div>
        <div className="flex flex-row overflow-y-auto h-screen max-md:hidden no-scrollbar">
          <AdminSidebar />
          <div className="overflow-y-auto flex-grow flex-col dark:bg-black">
            <AdminHead />
            <DashboardCards datas={data} loading={loading} />
            <div className="p-4">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-4 shadow-md">
                <h2 className="mb-2">
                  change api key for all users
                </h2>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your key here"
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-full mb-2"
                />
                <button
                  onClick={handleInputSubmit}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
