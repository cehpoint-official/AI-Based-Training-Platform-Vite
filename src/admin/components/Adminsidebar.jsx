import React from "react";
import LogoComponent from "@/components/LogoComponent";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import { MdSettingsInputComponent } from "react-icons/md";
import { AiFillMessage, AiFillProject } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { Sidebar } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import { GiGraduateCap } from "react-icons/gi";
import { BsRecordBtnFill } from "react-icons/bs";

const AdminSidebar = () => {
  const style = {
    root: {
      base: "h-full",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      inner:
        "h-full no-scrollbar overflow-y-auto overflow-x-hidden dark:text-white rounded-none border-black dark:border-white md:border-r bg-white py-4 px-3 dark:bg-black",
    },
  };

  const navigate = useNavigate();
  const location = useLocation(); // get current path

  // Function to check if the current route matches the target route
  const isActive = (path) => location.pathname === path;

  const linkItems = [
    { label: "DashBoard", icon: <MdSpaceDashboard size={18} />, path: "/dashBoard" },
    { label: "Projects", icon: <AiFillProject size={18} />, path: "/project" },
    { label: "Top Candidate", icon: <GiGraduateCap size={18} />, path: "/topcandidate" },
    { label: "Users", icon: <FaUsers size={18} />, path: "/users" },
    { label: "Courses", icon: <PiVideoFill size={18} />, path: "/courses" },
    { label: "Test Record", icon: <BsRecordBtnFill size={18} />, path: "/testrecord" },
    { label: "Admins", icon: <MdSettingsInputComponent size={18} />, path: "/admins" },
    { label: "Contacts", icon: <AiFillMessage size={18} />, path: "/contacts" },
    { label: "Terms", icon: <IoIosDocument size={18} />, path: "/editterms" },
    { label: "Privacy", icon: <IoIosDocument size={18} />, path: "/editprivacy" },
  ];

  return (
    <Sidebar theme={style} aria-label="Default sidebar example">
      <LogoComponent isDarkMode={false} />
      <Sidebar.Items className="mt-8">
        {linkItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-row items-center mt-2 p-2 rounded-md cursor-pointer ${
              isActive(item.path) ? "bg-black text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon}
            <p className="font-bold text-base ml-2">{item.label}</p>
          </div>
        ))}
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;
