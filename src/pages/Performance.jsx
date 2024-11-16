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
import { FaCheckCircle } from "react-icons/fa";
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
      const response = await axiosInstance.get(`/api/top-candidates-user`);
      const filteredData = response.data.data.filter(
        (item) => item.uid === userUID
      );

      if (filteredData.length > 0) {
        setData({ success: true, data: filteredData });
      } else {
        setData({ success: false, data: [] });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const projectCount = data?.data[0]?.projectCount || 0;
  const courseCount = data?.data[0]?.courseCount || 0;
  const quizScoreAvg = parseFloat(
    (data?.data[0]?.quizScoreAvg || 0).toFixed(2)
  );
  const averageProgress = parseFloat(
    (data?.data[0]?.averageProgress / 500 || 0).toFixed(2)
  ) ;

  // Ensure progress doesn't exceed 100% and calculate completion percentages
  const projectCountCompletion = projectCount >= projectCountCriteria ? 100 : 0;
  const courseCountCompletion = Math.min(
    (courseCount / courseCountCriteria) * 100,
    100
  );
  const quizScoreAvgCompletion = Math.min(
    (quizScoreAvg / quizScoreAvgCriteria) * 100,
    100
  );
  const averageProgressCompletion = Math.min(
    (averageProgress / averageProgressCriteria) * 100,
    100
  );

  // Calculate the total completion percentage
  const totalCompletionPercentage =
    (projectCountCompletion +
      courseCountCompletion +
      quizScoreAvgCompletion +
      averageProgressCompletion) /
    4;

  const completionPercentage = totalCompletionPercentage.toFixed(2);

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
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
            <CardContent>
              <Box
                display="flex justify-center"
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
              >
                <div className="flex items-center justify-center max-md:flex-col gap-x-10">
                  {/* Circular Progress */}
                  <Box position="relative" mr={2}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={220}
                      thickness={6}
                      sx={{
                        color: "#e0e0e0",
                        filter: "drop-shadow(0 0 10px rgba(255, 255, 0, 0.5))",
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={completionPercentage}
                      size={220}
                      thickness={6}
                      sx={{
                        color: "#FFEA00",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        filter: "drop-shadow(0 0 10px rgba(255, 234, 0, 0.8))",
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
                    alignItems="flex-start"
                    justifyContent="space-between"
                    width="100%"
                    gap="8px"
                  >
                    {/* Project Count */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Project Count: {projectCount}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={projectCountCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                        {projectCountCompletion === 100 && (
                          <FaCheckCircle
                            style={{ color: "green", marginLeft: "8px" }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Course Count */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Course Count: {courseCount}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={courseCountCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                        {courseCountCompletion === 100 && (
                          <FaCheckCircle
                            style={{ color: "green", marginLeft: "8px" }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Quiz Score Average */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Quiz Score Average: {quizScoreAvg}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={quizScoreAvgCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                        {quizScoreAvgCompletion === 100 && (
                          <FaCheckCircle
                            style={{ color: "green", marginLeft: "8px" }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Average Progress */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Average Progress: {averageProgress}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={averageProgressCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                        {averageProgressCompletion === 100 && (
                          <FaCheckCircle
                            style={{ color: "green", marginLeft: "8px" }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Box>
            </CardContent>
          </Card>
        )}
      </div>

      <Footers />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="There was an issue fetching the data."
      />
    </div>
  );
};

export default Performance;
