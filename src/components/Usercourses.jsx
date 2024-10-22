import React, { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import found from "@/assets/found.svg";
import axiosInstance from "../axios";

const UserCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      const postURL = `/api/course/${userId}`;
      try {
        const response = await axiosInstance.get(postURL);
        setCourses(response.data);
        setProcessing(false);
      } catch (error) {
        fetchUserCourses();
      }
    };

    fetchUserCourses();
  }, [userId]);

  const navigate = useNavigate();
  function redirectGenerate() {
    navigate("/create");
  }

  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
    const jsonData = JSON.parse(content);
    sessionStorage.setItem("courseId", courseId);
    sessionStorage.setItem("first", completed);
    sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
    let ending = "";
    if (completed) {
      ending = end;
    }
    navigate("/course", {
      state: {
        jsonData: jsonData,
        mainTopic: mainTopic.toUpperCase(),
        type: type.toLowerCase(),
        courseId: courseId,
        end: ending,
      },
    });
  };

  const handleCertificate = (mainTopic, end) => {
    const ending = new Date(end).toLocaleDateString();
    navigate("/certificate", {
      state: { courseTitle: mainTopic, end: ending },
    });
  };

  const style = {
    root: {
      base: "max-w-sm flex rounded-none border border-black bg-white shadow-none dark:border-white dark:bg-black m-4",
      children: "flex h-full flex-col justify-center gap-3 p-5",
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row",
      },
      href: "hover:bg-white dark:hover:bg-black",
    },
    img: {
      base: "",
      horizontal: {
        off: "rounded-none",
        on: "h-96 w-full rounded-none object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
      },
    },
  };

  return (
    <div className="my-4">
      {processing ? (
        <>
          <div className="text-center h-screen w-screen flex items-center justify-center">
            <Spinner size="xl" className="fill-black dark:fill-white" />
          </div>
        </>
      ) : (
        <>
          {courses.length === 0 ? (
            <div className="text-center h-center flex flex-col items-center justify-center">
              <img alt="img" src={found} className="max-w-sm h-3/6" />
              <p className="text-black font-black dark:text-white text-xl">
                Nothing Found
              </p>
              <button
                onClick={redirectGenerate}
                className="bg-black text-white px-5 py-2 mt-4 font-medium dark:bg-white dark:text-black"
              >
                Generate Course
              </button>
            </div>
          ) : (
            <div className="my-4 flex flex-wrap">
              {courses.map((course) => (
                <Card key={course._id} imgSrc={course.photo} theme={style}>
                  <h5 className="text-xl font-black tracking-tight text-black dark:text-white">
                    {course.mainTopic.toUpperCase()}
                  </h5>
                  <p className="font-normal text-sm capitalize text-black dark:text-white">
                    {course.type}
                  </p>
                  <p className="font-normal  text-sm  text-black dark:text-white">
                    {new Date(course.date).toLocaleDateString()}
                  </p>
                  <div className="flex-row flex space-x-4 ">
                    <button
                      onClick={() =>
                        handleCourse(
                          course.content,
                          course.mainTopic,
                          course.type,
                          course._id,
                          course.completed,
                          course.end
                        )
                      }
                      className="bg-black text-white px-5 py-2 font-medium dark:bg-white dark:text-black"
                    >
                      Continue
                    </button>
                    {course.completed ? (
                      <button
                        onClick={() =>
                          handleCertificate(course.mainTopic, course.end)
                        }
                        className="border-black text-black border px-5 py-2 font-medium dark:border-white dark:text-white"
                      >
                        Certificate
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserCourses;
