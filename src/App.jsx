import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/Resetpassword";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Topics from "./pages/Topics";
import Course from "./pages/Course";
import Certificate from "./pages/Certificate";
import Profile from "./pages/Profile";
import TermsPolicy from "./pages/Termspolicy";
import Features from "./pages/Features";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import DashBoard from "./admin/Dashboard";
import Users from "./admin/Users";
import Courses from "./admin/Courses";

import Admins from "./admin/Admins";
import Contacts from "./admin/Contacts";

import ErrorPage from "./pages/ErrorPage";

import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <ToastContainer
          limit={3}
          progressClassName={
            sessionStorage.getItem("darkMode") === "true"
              ? "toastProgressDark"
              : "toastProgress"
          }
          bodyClassName={
            sessionStorage.getItem("darkMode") === "true"
              ? "toastBodyDark"
              : "toastBody"
          }
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={
            sessionStorage.getItem("darkMode") === "true" ? "dark" : "light"
          }
        />
        <Routes>
          {/* Main App */}
          <Route path="/" exact element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/course" element={<Course />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsPolicy />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Admin Panel */}
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
