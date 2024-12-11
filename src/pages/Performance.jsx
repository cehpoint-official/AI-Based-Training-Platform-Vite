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
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import moment from "moment";

const Performance = () => {
  const [userUID, setUserUID] = useState(sessionStorage.getItem("uid"));
  const [data, setData] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [globalUpdateDone, setGlobalUpdateDone] = useState(false);
  const [courseCompletionData, setCourseCompletionData] = useState([]);

  const fetchPerformanceAll = async () => {
    try {
      const response = await axiosInstance.get(`/api/performance/all`);
      const re = await axiosInstance.post("/api/updateCountsForAllUsers");
      setGlobalUpdateDone(true); // Mark global update as done
    } catch (error) {
      console.error("Error updating all user performance data:", error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axiosInstance.get(`/api/performance/${userUID}`);
      const performanceData = response?.data?.data;

      if (response?.data?.success && performanceData) {
        // console.log(performanceData.max_strick)
        setData({ success: true, ...performanceData });
        setPerformanceScore(performanceData?.performanceScore);

        // Extract daily performance and sort by date
        const dailyPerformance = performanceData?.dailyPerformance || [];
        // console.log(dailyPerformance);
        dailyPerformance.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Map data to include a `color` field for visualization
        const updatedCourseCompletionData = dailyPerformance.map((entry) => ({
          date: moment(entry.date).format("YYYY-MM-DD"), // Format the date
          count: entry.count || 0, // Use the `count` field from the backend
          color: entry.count > 0 ? "green" : "red", // Assign color based on count
        }));

        setCourseCompletionData(updatedCourseCompletionData); // Update the state with new data
      } else {
        setData({ success: false, data: [] });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user performance data:", error);
      setLoading(false);
      setOpenSnackbar(true); // Show error notification
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userUID) {
        console.error("User ID not found in session storage.");
        setLoading(false);
        return;
      }

      if (!globalUpdateDone) {
        await fetchPerformanceAll();
      }

      await fetchPerformance();
    };

    fetchData();
  }, [userUID, globalUpdateDone]);

  const projectCountCriteria = 1;
  const courseCountCriteria = 5;
  const quizScoreAvgCriteria = 25;
  const averageProgressCriteria = 100;

  const projectCount = performanceScore?.projectCount || 0;
  const courseCount = performanceScore?.courseCount || 0;
  const quizScoreAvg = parseFloat(
    (performanceScore?.quizScoreAvg || 0).toFixed(2)
  );
  const averageProgress = parseFloat(
    (performanceScore?.averageProgress / 500 || 0).toFixed(2)
  );

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

  const totalCompletionPercentage =
    (projectCountCompletion +
      courseCountCompletion +
      quizScoreAvgCompletion +
      averageProgressCompletion) /
    4;

  const completionPercentage = totalCompletionPercentage.toFixed(2);

  // Generate all dates in the past year
  const generateFullYearData = () => {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");

    const fullYearData = [];
    for (
      let date = moment(startOfYear);
      date.isBefore(endOfYear);
      date.add(1, "days")
    ) {
      const foundEntry = courseCompletionData.find(
        (entry) => entry.date === date.format("YYYY-MM-DD")
      );
      fullYearData.push(
        foundEntry || { date: date.format("YYYY-MM-DD"), count: 0 } // Fill missing days with count: 0
      );
    }
    return fullYearData;
  };

  // Use this data to update heatmapData
  const heatmapData = generateFullYearData();

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
                        Project Count: {projectCount}/{projectCountCriteria}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={projectCountCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                      </Box>
                    </Box>
                    {/* Course Count */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Course Count: {courseCount}/{courseCountCriteria}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={courseCountCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                      </Box>
                    </Box>
                    {/* Quiz Score Average */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Quiz Score Average: {quizScoreAvg}/{quizScoreAvgCriteria} %
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={quizScoreAvgCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                      </Box>
                    </Box>
                    {/* Average Progress */}
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography
                        variant="subtitle1"
                        className="mb-1 text-white"
                      >
                        Average Progress: {averageProgress}/{averageProgressCriteria} %
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={averageProgressCompletion}
                          style={{ width: "300px", height: "10px" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Box>
            </CardContent>
          </Card>
        )}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md my-4">
          <h3 className="text-md font-semibold mb-2">Important Note:</h3>
          <p className="text-xs mb-2">
            To proceed with the test, you need to meet the following criteria:
          </p>
          <ul className="list-disc list-inside pl-4 text-xs">
            <li>
              <span className="font-medium">Project Count:</span> Complete at
              least <strong>1 project</strong>.
            </li>
            <li>
              <span className="font-medium">Course Count:</span> Complete at
              least <strong>5 courses</strong>.
            </li>
            <li>
              <span className="font-medium">Average Quiz Score:</span> Achieve a
              minimum score of <strong>25</strong>.
            </li>
            <li>
              <span className="font-medium">Average Progress:</span> Maintain{" "}
              <strong>100% progress</strong> in your courses.
            </li>
          </ul>
          <p className="text-xs mt-2">
            Please ensure these requirements are met before starting the test.
            Good luck!
          </p>
        </div>
        <div className="w-full text-sm text-center flex max-md:flex-col items-center justify-center gap-y-3 gap-x-10 mt-4 mb-8">
          <span className="px-8 py-3 bg-green-600 font-bold rounded-md uppercase">
            Max Strick: {data?.max_strick}
          </span>
          <span className="px-8 py-3 bg-green-500 font-bold rounded-md uppercase">
            Current Strick: {data?.strick}
          </span>
        </div>
        <div className="flex items-center justify-center overflow-x-auto overflow-y-hidden w-full">
          <div className="w-[200%] md:w-[80%] flex items-center justify-center flex-col">
            <CalendarHeatmap
              startDate={moment().startOf("year").toDate()}
              endDate={moment().endOf("year").toDate()}
              values={generateFullYearData()}
              gutterSize={1}
              showWeekdayLabels
              classForValue={(value) => {
                if (!value) return "fill-gray-300";
                return value.count > 0 ? "fill-green-500" : "fill-gray-300";
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": value
                  ? `Date: ${value.date} | Count: ${value.count}`
                  : "No data",
              })}
            />
          </div>
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message="Error fetching performance data"
        />
      </div>
      <Footers />
    </div>
  );
};

export default Performance;
