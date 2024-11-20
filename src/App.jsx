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
// import APIKeyForm from "./pages/APIKeyForm";
import PrivacyPolicy from "./pages/Privacy";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import DashBoard from "./admin/Dashboard";
import Users from "./admin/Users";
import Courses from "./admin/Courses";
import Verify from "./pages/Verify";
import Admins from "./admin/Admins";
import Contacts from "./admin/Contacts";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";

import "./App.css";
import Quiz from "./quiz/Quiz";
import Project from "./admin/Project";

import Myproject from "./pages/Myproject";
import TestPage from "./components/Interview/TestPage";
import ExpectationPage from "./components/Interview/ExpectationPage";
import Final from "./components/Interview/Final";
import { SkillsProvider } from "./Context/skills";
import Topcandidate from "./admin/Topcandidate";
import TestRecord from "./admin/TestRecord";
import Performance from "./pages/Performance";




function App() {
  return (
    <SkillsProvider>
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
          <Route path="/verify" element={<Verify></Verify>}/>
          <Route path="/myproject" element={<Myproject />} />

          {/* protected routes accessibel after verification */}
          <Route element={<ProtectedRoutes></ProtectedRoutes>} >
            <Route path="/home" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
          </Route>


          <Route path="/quiz" element={<Quiz />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/course" element={<Course />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/performance" element={<Performance />} />

          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          
          {/* Interview */}

          <Route path="/testpage" element={<TestPage />} />
          <Route path="/:uid/expectation" element={<ExpectationPage />} />
          <Route path="/:uid/final" element={<Final />} />


          {/* Admin Panel */}
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/project" element={<Project />} />

          <Route path="/topcandidate" element={<Topcandidate />} />

          <Route path="/users" element={<Users />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/testrecord" element={<TestRecord />} />
          
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      </SkillsProvider>
  );
}

export default App;
