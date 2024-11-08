import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import Header from "../components/header";
import Footers from "../components/footers";
import axiosInstance from "../axios";

const Performance = () => {
  const [userUID, setUserUID] = useState(sessionStorage.getItem("uid"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchPerformance = async () => {
    try {
      const response = await axiosInstance.get(`/api/top-candidates-admin`);
      // Filter data based on uid
      const filteredData = response.data.data.filter(
        (item) => item.uid === userUID
      );

      if (filteredData.length > 0) {
        setData({ success: true, data: filteredData });
      } else {
        setData({ success: false, data: [] }); // No data found for this UID
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (userUID) {
      fetchPerformance();
    } else {
      console.error("User ID not found in session storage.");
      setLoading(false);
    }
  }, [userUID]);

  const projectCountCriteria = 1;
  const courseCountCriteria = 5;
  const quizScoreAvgCriteria = 25;
  const averageProgressCriteria = 100;

  // Use optional chaining and set default values to avoid TypeError
  const projectCount = data?.data[0]?.projectCount || 0;
  const courseCount = data?.data[0]?.courseCount || 0;
  const quizScoreAvg = data?.data[0]?.quizScoreAvg || 0;
  const averageProgress = data?.data[0]?.averageProgress || 0;

  const totalCriteriaMet =
    (projectCount >= projectCountCriteria ? 1 : 0) +
    (courseCount >= courseCountCriteria ? 1 : 0) +
    (quizScoreAvg >= quizScoreAvgCriteria ? 1 : 0) +
    (averageProgress >= averageProgressCriteria ? 1 : 0);

  const completionPercentage = (totalCriteriaMet / 4) * 100;

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="flex-1 dark:bg-gray-900 bg-gray-800 dark:text-white text-white p-4 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Performance Overview</h2>
        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress />
            <Typography variant="body1" className="ml-2">
              Loading data...
            </Typography>
          </Box>
        ) : (
          <Card
            className="w-full mb-4 flex item-center justify-center"
            style={{ backgroundColor: "transparent" }}
          >
            {" "}
            {/* Transparent background */}
            <CardContent>
              <Box
                display="flex justify-center"
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
              >
                <div className="flex items-center justify-center gap-x-10">
                  {/* Circular Progress */}
                  <Box position="relative" mr={2}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={220} // Increased size
                      thickness={6}
                      sx={{
                        color: "#e0e0e0",
                        filter: "drop-shadow(0 0 10px rgba(255, 255, 0, 0.5))",
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={completionPercentage}
                      size={220} // Increased size
                      thickness={6}
                      sx={{
                        color: "#FFEA00", // Yellow color for progress
                        position: "absolute",
                        top: 0,
                        left: 0,
                        filter: "drop-shadow(0 0 10px rgba(255, 234, 0, 0.8))", // Glowing effect
                      }}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="textSecondary"
                        className=""
                      >
                        <p className="text-2xl text-white">{`${Math.round(
                          completionPercentage
                        )}%`}</p>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Linear Progress Bars */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="mb-2 text-white"
                      >
                        Project Count: {projectCount}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(projectCount / projectCountCriteria) * 100}
                        style={{ width: "300px", height: "10px" }} // Set your desired height here
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="mb-2 text-white"
                      >
                        Course Count: {courseCount}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(courseCount / courseCountCriteria) * 100}
                        style={{ width: "300px", height: "10px" }} // Set your desired height here
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="mb-2 text-white"
                      >
                        Quiz Score Average: {quizScoreAvg}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(quizScoreAvg / quizScoreAvgCriteria) * 100}
                        style={{ width: "300px", height: "10px" }} // Set your desired height here
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="mb-2 text-white"
                      >
                        Average Progress: {averageProgress}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (averageProgress / averageProgressCriteria) * 100
                        }
                        style={{ width: "300px", height: "10px" }} // Set your desired height here
                      />
                    </Box>
                  </Box>
                </div>
              </Box>
            </CardContent>
          </Card>
        )}
        <Box className="mt-4">
          {Math.round(completionPercentage) === 100 ? (
            <Typography variant="h6" className="text-green-500 text-sm">
              Eligible for the Test round!
            </Typography>
          ) : (
            <Typography variant="h6" className="text-red-500 text-sm">
              Not eligible for the Test round.{" "}
              <span className="font-semibold">
                Practice more and try again!
              </span>
            </Typography>
          )}
          <Typography variant="body1" className="mt-2 text-white/80 text-sm">
            You need to meet the following criteria to be eligible for the test:
          </Typography>
          <ul className="list-disc list-inside text-white/70 mt-1 text-sm">
            <li>Project Count: At least {projectCountCriteria} (Accepted)</li>
            <li>Course Count: At least {courseCountCriteria} or more</li>
            <li>Quiz Score Average: At least {quizScoreAvgCriteria} or more</li>
            <li>Average Progress: 100</li>
          </ul>
        </Box>
      </div>

      <Footers className="sticky bottom-0 z-50" />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Error fetching projects. Please try again later."
      />
    </div>
  );
};

export default Performance;
