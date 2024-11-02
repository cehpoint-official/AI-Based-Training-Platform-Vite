import React, { useEffect } from "react";
import { Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
const AdminHead = () => {
  const navigate = useNavigate();
  function redirectHome() {
    navigate("/home");
  }

  // useEffect(() => {
  //   async function dashboardData() {
  //     const postURL = `/api/dashboard`;
  //     const response = await axiosInstance.post(postURL);
  //     // sessionStorage.setItem("adminEmail", response.data.admin.email);
  //     console.log("Admin Email from Response:", response.data.admin.email);
  //     console.log(
  //       "Email from Session Storage:",
  //       sessionStorage.getItem("email")
  //     );
  //     // if (response.data.admin.email !== sessionStorage.getItem("email")) {
  //     //   redirectHome();
  //     // }
  //   }
  //   // if (sessionStorage.getItem("adminEmail")) {
  //   //   if (
  //   //     sessionStorage.getItem("adminEmail") !== sessionStorage.getItem("email")
  //   //   ) {
  //   //     redirectHome();
  //   //   }
  //   // } else {
  //   //   dashboardData();
  //   // }
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    sessionStorage.setItem("darkMode", false);
    
    async function dashboardData() {
      try {
        // First, fetch the list of admins
        const adminURL = `/api/getadmins`;
        const adminResponse = await axiosInstance.get(adminURL);
        const admins = adminResponse.data.admins;
        
        // Get the current user's email from sessionStorage
        const currentUserEmail = sessionStorage.getItem("email");
        
        // Check if the current user is an admin
        const isAdmin = admins.some(admin => admin.email === currentUserEmail);
        
        if (isAdmin) {
          // If the user is an admin, fetch dashboard data
          const dashboardURL = `/api/dashboard`;
          const dashboardResponse = await axiosInstance.post(dashboardURL);
          
          console.log("Admin Email from Response:", dashboardResponse.data.admin.email);
          console.log("Email from Session Storage:", currentUserEmail);
          
          // Set admin and user data
          setAdmin(admins);
          setUser(dashboardResponse.data.users);
        } else {
          // If the user is not an admin, redirect to home
          redirectHome();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally redirect on error
        // redirectHome();
      } finally {
        setLoading(false);
      }
    }
  
    dashboardData();
  }, []);
  
  return (
    <Navbar
      fluid
      className="py-5 dark:bg-black bg-white border-black dark:text-white dark:border-white md:border-b"
    >
      <p className="font-black text-xl">Admin Panel</p>
    </Navbar>
  );
};

export default AdminHead;
