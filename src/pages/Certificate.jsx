import React, { useRef, useEffect, useState } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import emailjs from "@emailjs/browser"; // Make sure to import EmailJS

const Certificate = ({ userName, userEmail, courseTitle, userId }) => {
  const [processing, setProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Add state to track email sending
  const pdfRef = useRef(null);

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
      message: download,
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
    <div className="h-screen flex flex-col text-black">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="flex-1">
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <p className="text-center font-black text-4xl text-black dark:text-white">
            Congratulations🎉
          </p>
          <p className="text-center font-normal text-black py-4 dark:text-white">
            <strong>{userName}</strong> on completion of course{" "}
            <strong>{courseTitle}</strong>. <br /> Your certificate is being
            processed.
          </p>
          {processing && (
            <AiOutlineLoading className="h-6 w-6 animate-spin dark:text-white text-black mt-4" />
          )}
          <div
            ref={pdfRef}
            className="bg-white dark:bg-black flex justify-center items-center mt-8"
            style={{ width: "640px", height: "480px" }} // Ensures a 4:3 aspect ratio
          >
            <div className="certificate border-2 bg-white border-black w-full h-full py-12 px-16 text-center">
              <h1 className="font-bold text-3xl mb-6">
                Certificate of Completion 🥇
              </h1>
              <p>This is to certify that</p>
              <h2 className="font-semibold text-lg mt-6">{userName}</h2>
              <p>has successfully completed the course on</p>
              <h3 className="font-semibold text-base mt-4">{courseTitle}</h3>
            </div>
          </div>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default Certificate;
