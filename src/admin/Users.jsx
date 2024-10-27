import { Navbar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "./components/adminsidebar";
import AdminHead from "./components/adminhead";
import AdminSidebarMobile from "./components/adminsidebarmobile";
import UserTable from "./components/usertable";
import axiosInstance from "../axios";

const Users = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("darkMode", false);
    async function dashboardData() {
      try {
        const postURL = `/api/getusers`;
        const response = await axiosInstance.get(postURL);
        // console.log("GGGG", response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }
    dashboardData();
  }, []);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axiosInstance.get(`/api/getprojects`);
        console.log(response.data.data)
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchProjects();
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
              <UserTable datas={data} />
            </div>
            <AdminSidebarMobile isSidebarOpen={isSidebarOpen} />
          </div>
        </div>
        <div className="flex flex-row overflow-y-auto h-screen max-md:hidden no-scrollbar">
          <AdminSidebar />
          <div className="overflow-y-auto flex-grow flex-col dark:bg-black">
            <AdminHead />
            <UserTable datas={data} loading={loading} projects={projects} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Users;
