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
import CalendarHeatmap from "react-calendar-heatmap";import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
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
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  const fetchPerformanceAll = async () => {
    try {
      await axiosInstance.get(`/api/performance/all`);
      await axiosInstance.post("/api/updateCountsForAllUsers");
      setGlobalUpdateDone(true);
    } catch (error) {
      console.error("Error updating all user performance data:", error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axiosInstance.get(`/api/performance/${userUID}`);
      const performanceData = response?.data?.data;

      if (response?.data?.success && performanceData) {
        setData({ success: true, ...performanceData });
        setPerformanceScore(performanceData?.performanceScore);

        const dailyPerformance = performanceData?.dailyPerformance || [];
        dailyPerformance.sort((a, b) => new Date(a.date) - new Date(b.date));

        const updatedCourseCompletionData = dailyPerformance.map((entry) => ({
          date: moment(entry.date).format("YYYY-MM-DD"),
          count: entry.count || 0,
        }));

        setCourseCompletionData(updatedCourseCompletionData);
      } else {
        setData({ success: false, data: [] });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user performance data:", error);
      setLoading(false);
      setOpenSnackbar(true);
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

  const generateMonthData = () => {
    const startOfMonth = moment(`${selectedYear}-${selectedMonth}-01`);
    const endOfMonth = startOfMonth.clone().endOf("month");

    const monthData = [];
    for (
      let date = startOfMonth.clone();
      date.isBefore(endOfMonth);
      date.add(1, "days")
    ) {
      const foundEntry = courseCompletionData.find(
        (entry) => entry.date === date.format("YYYY-MM-DD")
      );
      monthData.push(
        foundEntry || { date: date.format("YYYY-MM-DD"), count: 0 }
      );
    }
    return monthData;
  };

  const heatmapData = generateMonthData();

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Header isHome={true} className="sticky top-0 z-50" />
      <div className="flex-1 dark:bg-gray-900 bg-gray-800 dark:text-white text-white p-4 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Performance Overview</h2>
        <FormControl
          style={{
            minWidth: 120,
            marginBottom: 20,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[...Array(5)].map((_, i) => {
              const year = moment().year() - i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl
          style={{
            minWidth: 120,
            marginBottom: 20,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {moment.months().map((month, index) => (
              <MenuItem key={month} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            className="w-full mb-4 flex items-center justify-center"
            style={{
              backgroundColor: "transparent",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <CardContent>
              <Typography variant="h6" align="center">
                Performance Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Add any other metrics as necessary */}
              </Box>
            </CardContent>
          </Card>
        )}
        <div
          className="flex items-center justify-center w-full"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <CalendarHeatmap
            startDate={moment(`${selectedYear}-${selectedMonth}-01`).toDate()}
            endDate={moment(`${selectedYear}-${selectedMonth}-01`)
              .endOf("month")
              .toDate()}
            values={heatmapData}
            gutterSize={2}
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
            style={{
              width: "100%",
              maxWidth: "300px",
              margin: "0 auto",
              fontSize: "0.7rem",
            }}
          />
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

import "react-calendar-heatmap/dist/styles.css";
import moment from "moment";

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
  );

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

  // Simulated daily data for the calendar heatmap
  const courseCompletionData = data?.data[0]?.dailyCourseCompletion || [
    // Example data (replace with real API data if available)
    { date: "2023-11-20", count: 1 },
    { date: "2023-11-21", count: 2 },
    { date: "2023-11-22", count: 0 },
    { date: "2023-11-23", count: 3 },
  ];

  // Transform data to match the heatmap format
  const heatmapData = courseCompletionData.map((entry) => ({
    date: moment(entry.date).format("YYYY-MM-DD"), // Format date
    count: entry.count, // Number of courses completed on that date
  }));

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

                    {/* Other Progress Details */}
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

        {/* Calendar Heatmap Feature */}
        <h3 className="text-lg font-bold mb-4 mt-8">Your Learning Activity</h3>
        <CalendarHeatmap
          startDate={moment().subtract(1, "year").format("YYYY-MM-DD")}
          endDate={moment().format("YYYY-MM-DD")}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return "color-empty";
            }
            if (value.count <= 2) {
              return "color-scale-1";
            }
            if (value.count <= 4) {
              return "color-scale-2";
            }
            return "color-scale-3";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tip": value
              ? `${value.date}: ${value.count} courses completed`
              : "No data",
          })}
          showWeekdayLabels={true}
        />
        <style>
          {`
            .color-empty {
              fill: #ebedf0;
            }
            .color-scale-1 {
              fill: #c6e48b;
            }
            .color-scale-2 {
              fill: #7bc96f;
            }
            .color-scale-3 {
              fill: #239a3b;
            }
          `}
        </style>
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
