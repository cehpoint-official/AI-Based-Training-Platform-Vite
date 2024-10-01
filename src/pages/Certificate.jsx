import React, { useEffect, useState, useRef } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { Button } from "flowbite-react";
import Quiz from "../quiz/Quiz";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import { useLocation, useNavigate } from "react-router-dom";
import Logos from "@/assets/logo.svg";
import axios from "axios";

const Certificate = () => {
  const [processing, setProcessing] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  // eslint-disable-next-line
  const [userScore, setUserScore] = useState(0);

  const userName = sessionStorage.getItem("mName");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseTitle, end } = state || {};

  const pdfRef = useRef(null);

  const handleDownload = async () => {
    toPng(pdfRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "certificate.png";
        link.href = dataUrl;
        link.click();
        showToast("Downloaded");
      })
      .catch((err) => {
        console.error("Error generating image", err);
      });
  };

  useEffect(() => {
    if (!courseTitle) {
      navigate("/create");
    } else {
      // Example axios call to fetch data related to the course or user
      axios
        .get("/api/course-details", { params: { title: courseTitle } })
        .then((response) => {
          const courseDetails = response.data;
          console.log("Course details:", courseDetails);
        })
        .catch((error) => {
          console.error(
            `Error fetching details for course: ${courseTitle}`,
            error
          );
          showToast("Failed to fetch course details. Please try again later.");
        });
    }
  }, [courseTitle, navigate]);

  const handleQuizCompletion = (finalScore) => {
    setUserScore(finalScore);
    if (finalScore === 10) {
      setQuizCompleted(true);
      showToast("Quiz passed! You can download your certificate now.");
    } else {
      showToast("You need to score 10/10 to get the certificate. Try again.");
    }
  };

  const showToast = async (msg) => {
    setProcessing(false);
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
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        {!quizCompleted ? (
          <Quiz courseTitle={courseTitle} onCompletion={handleQuizCompletion} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <p className="text-center font-black text-4xl text-black dark:text-white">
              Congratulations🎉
            </p>
            <p className="text-center font-normal text-black py-4 dark:text-white">
              <strong>{userName}</strong> on completion of course{" "}
              <strong>{courseTitle}</strong>. <br /> Download your certificate
            </p>
            <Button
              onClick={handleDownload}
              isProcessing={processing}
              processingSpinner={
                <AiOutlineLoading className="h-6 w-6 animate-spin" />
              }
              className="items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none max-w-sm enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
              type="submit"
            >
              Download
            </Button>
            <div
              ref={pdfRef}
              className="bg-white dark:bg-black flex justify-center items-center"
            >
              <div className="certificate border-2 bg-white border-black w-9/12 py-36 mx-4 px-12 my-5 text-center">
                <h1 className="font-bold text-3xl mb-6">
                  Certificate of Completion 🥇
                </h1>
                <p>This is to certify that</p>
                <h2 className="font-semibold text-lg mt-6">{userName}</h2>
                <p>has successfully completed the course on</p>
                <h3 className="font-semibold text-base mt-4">{courseTitle}</h3>
                <p>on {end}.</p>
                <img
                  src={Logos}
                  alt="logo"
                  className="w-10 h-10 mx-auto mt-6"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Certificate;
