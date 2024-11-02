// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const reportSnapshot = await getDocs(collection(db, 'reports'));
      setReports(reportSnapshot.docs.map(doc => doc.data()));
    };
    fetchReports();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {reports.map((report, index) => (
        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{report.candidateName}</h2>
          <p>Email: {report.candidateEmail}</p>
          <p>Score: {report.score}</p>
          <p>Recording: <a href={report.recordingURL}>View Recording</a></p>
        </div>
      ))}
    </div>
  );
};
export default AdminDashboard;