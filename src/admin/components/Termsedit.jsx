import axios from "axios";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const TermsEdit = () => {
  const [terms, setTerms] = useState(sessionStorage.getItem("terms"));

  const handleTextAreaChange = (e) => {
    setTerms(e.target.value);
    adjustTextAreaHeight(e.target);
  };

  const adjustTextAreaHeight = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const showToast = async (msg) => {
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

  async function saveTerms() {
    const postURL = "/api/saveadmin";
    const response = await axios.post(postURL, { data: terms, type: "terms" });
    if (response.data.success) {
      sessionStorage.setItem("terms", terms);
      showToast(response.data.message);
    }
  }

  return (
    <div>
      <div className="flex flex-row">
        <h1 className="text-black font-black text-3xl p-4">Terms</h1>
        <Button
          onClick={saveTerms}
          className=" text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none max-w-md enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent m-4"
        >
          Submit
        </Button>
      </div>
      <div className="textarea-container">
        <textarea
          placeholder="Write your terms here in HTML format"
          onChange={handleTextAreaChange}
          className="textarea focus:ring-transparent focus:border-none border border-none font-normal bg-white rounded-none block w-11/12 dark:bg-black dark:border-white dark:text-white m-4"
          value={terms}
          rows={1}
          style={{ minHeight: "5rem" }}
        />
      </div>
    </div>
  );
};

export default TermsEdit;
