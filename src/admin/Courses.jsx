import { Navbar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "./components/Adminsidebar";
import AdminHead from "./components/Adminhead";
import AdminSidebarMobile from "./components/Adminsidebarmobile";
import CourseTable from "./components/Coursetable";
import axiosInstance from "../axios";

const Courses = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("darkMode", false);
    async function dashboardData() {
      const postURL = `/api/getcourses`;
      const response = await axiosInstance.get(postURL);
      setData(response.data);
    }
    dashboardData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              <CourseTable datas={data} />
            </div>
            <AdminSidebarMobile isSidebarOpen={isSidebarOpen} />
          </div>
        </div>
        <div className="flex flex-row overflow-y-auto h-screen max-md:hidden no-scrollbar">
          <AdminSidebar />
          <div className="overflow-y-auto flex-grow flex-col dark:bg-black">
            <AdminHead />
            <CourseTable datas={data} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Courses;
