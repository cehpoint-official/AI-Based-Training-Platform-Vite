import React, { useRef, useEffect, useState } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import emailjs from "@emailjs/browser"; // Make sure to import EmailJS

const Certificate = ({ userName, userEmail, courseTitle, userId }) => {
  const [processing, setProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Add state to track email sending
  const pdfRef = useRef(null);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) =>
        word.length > 1
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toLowerCase()
      )
      .join(" ");
  };

  const getUserNameFontSize = (text) => {
    const wordCount = text.split("").length;
    if (wordCount > 35) {
      return "text-2xl";
    } else if (wordCount > 25) {
      return "text-3xl";
    } else if (wordCount > 20) {
      return "text-4xl";
    } else {
      return "text-5xl";
    }
  };

  const getCourseTitleFontSize = (text) => {
    const wordCount = text.split("").length;
    if (wordCount > 25) {
      return "text-[1rem]"; // For course titles with more than 25 words
    } else if (wordCount > 20) {
      return "text-xl"; // For course titles with more than 20 words
    } else {
      return "text-2xl"; // Default size
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (emailSent || !userName || !userEmail || !courseTitle || !userId) return;
    let isMounted = true;
    const generateCertificate = async () => {
      if (!isMounted) return;
      setProcessing(true); // Show loading state
      try {
        // Convert the certificate HTML to an image
        const dataUrl = await toPng(pdfRef.current, { cacheBust: false });

        // Upload the image to Firebase Storage
        const storage = getStorage();
        const certificateRef = ref(
          storage,
          `certificates/certificate_${userId}.png`
        );
        await uploadString(certificateRef, dataUrl, "data_url");

        // Get the download URL of the certificate image
        const downloadURL = await getDownloadURL(certificateRef);

        // Send the certificate download URL via Email
        sendEmail(downloadURL); // Email the certificate URL
        showToast("Certificate generated, uploaded, and emailed!");
      } catch (err) {
        console.error("Error generating certificate", err);
        showToast("Error generating certificate");
      } finally {
        setProcessing(false); // Reset loading state
        setEmailSent(true); // Mark email as sent
      }
    };

    const timer = setTimeout(() => {
      generateCertificate();
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer)
    };
  }, [userName, userEmail, courseTitle, userId, emailSent]);

  // Email Sending Logic
  const sendEmail = (download) => {
    const emailData = {
      userName: userName,
      userEmail: userEmail,
      imageUrl: download,
      courseTitle: courseTitle
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          showToast("SUCCESS! Email sent");
        },
        (error) => {
          console.log("FAILED...", error.text);
          showToast("Failed!!");
        }
      );
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
    <div className="flex-1 overflow-x-hidden overflow-y-auto w-full h-full scrollbar-none">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <p className="text-center font-black text-4xl text-black dark:text-white">
          Congratulations🎉
        </p>
        <p className="text-center font-normal text-black py-4 dark:text-white">
          <strong>{userName || "Unknown"}</strong> on completion of course{" "}
          <strong>{courseTitle || "Unknown"}</strong>. <br />
          {emailSent ? (
            <>
              <p>
                Your certificate has been sent to your email. <i>{userEmail}</i>{" "}
              </p>
              <p>
                Please check your inbox,and if you don't see it, make sure to
                check your spam or junk folder.
              </p>
            </>
          ) : (
            <p>Your certificate is being processed.</p>
          )}
        </p>
        {processing && (
          <AiOutlineLoading className="h-6 w-6 animate-spin dark:text-white text-black mt-4" />
        )}
        <div
          ref={pdfRef}
          className={`bg-[url('/Certificate.png')] w-[1000px] bg-contain bg-center flex justify-center items-center aspect-[4.3/3] relative`}
        >
          <div className="certificate w-full h-full py-12 px-16 text-center">
            <div className=" absolute top-[44%] left-[25.5%] w-[30.7rem]">
              <h1
                className={`cerUserName font-bold ${getUserNameFontSize(
                  userName || "Unknown"
                )} text-black`}
              >
                {/* Arnab Bhattacharyya{userName} */}
                {toTitleCase(userName || "Unknown")}
                {/* {toTitleCase("ArnaB bHattacharyya")} */}
              </h1>
            </div>
            <div className="w-[16rem] absolute left-[50%] top-[53%] h-[2rem] flex items-center justify-center ">
              <h3
                className={`cerCourseTitle font-bold text-xl italic text-center text-black ${getCourseTitleFontSize(
                  courseTitle || "Unknown"
                )} `}
              >
                {/* Full Stack Development{courseTitle} */}
                {toTitleCase(courseTitle) || "Unknown"}
                {/* {toTitleCase("DeVelopment")} */}
              </h3>
            </div>
            <div className="absolute left-[26%] top-[58%] w-[9.5rem] flex items-center justify-center">
              <h3 className="font-semibold text-center text-black italic cerCourseDate ">
                {getCurrentDate()}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
