// import React, { useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom' // For navigation
// import { checkToken } from '../../Api/Users/Users'
// import { fetchDashBoardData } from '../../Api/Dashboard/Dashboard'

// const ProjectStatus = () => {
//     const history = useHistory()  // Initialize history for navigation
//     const [userType, setUserType] = useState('')
//     const [counts, setCounts] = useState({})
//     const [recentAddedBooks, setRecentAddedBooks] = useState([])
//     const [recentAddedStudents, setRecentAddedStudents] = useState([])
//     const [recentBorrows, setRecentBorrows] = useState([])
//     const [recentReservations, setRecentReservations] = useState([])
//     const [PMrecentAddedBooks, setPMrecentAddedBooks] = useState([])
//     const [PMrecentAddedStudents, setPMrecentAddedStudents] = useState([])

//     useEffect(() => {
//         let isCancelled = false; // To handle cleanup of async operations

//         const fetchApi = async () => {
//             const res = await checkToken("")
//             if (res === undefined || res.status === 401) {
//                 history.push('/') // Redirect to home if no valid token or unauthorized
//             } else {
//                 const data = await fetchDashBoardData()

//                 if (!isCancelled) {
//                     // Set data based on the userType
//                     if (res.data.userType === 'PD') {
//                         setUserType(res.data.userType)
//                         setCounts(data.counts)
//                         setRecentAddedBooks(data.recentBooks)
//                         setRecentAddedStudents(data.recentStudents)
//                         setRecentBorrows(data.recentBorrows)
//                         setRecentReservations(data.recentReservations)
//                     } else {
//                         setUserType(res.data.userType)
//                         setCounts(data.counts)
//                         setPMrecentAddedBooks(data.PMrecentAddedBooks)
//                         setPMrecentAddedStudents(data.PMrecentAddedStudents)
//                     }
//                 }
//             }
//         }

//         fetchApi()

//         return () => {
//             // Cleanup on component unmount
//             isCancelled = true
//         }
//     }, [history])

//     return (
//         <div>
//             <h1>Project Status</h1>
//             {userType === 'admin' ? (
//                 <div>
//                     <h2>Admin View</h2>
//                     <div>Counts: {JSON.stringify(counts)}</div>
//                     {/* Render other admin-specific data */}
//                 </div>
//             ) : (
//                 <div>
//                     <h2>Project Manager View</h2>
//                     <div>PM Counts: {JSON.stringify(counts)}</div>
//                     {/* Render other project manager-specific data */}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ProjectStatus

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [TL, setTL] = useState([]); // State to store project lead data

  // Fetch project lead data
  const getTL = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/create"
      );
      setTL(response.data); // Set the project lead data
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch project status data
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/get-status"
      ); // Your API endpoint
      setData(response.data.data);
      console.log(response.data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (err) {
      console.error(err.message);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    getData(); // Fetch project status data
    getTL(); // Fetch project lead data
  }, []);

  // Function to get the project lead for a specific project
  const getProjectLead = (projectname) => {
    const projectLead = TL.find((item) => item.projectname === projectname);
    return projectLead ? projectLead.plname : "No Lead Assigned";
  };

  // Function to get class based on project status (Only text color)
  const getStatusClass = (status) => {
    switch (status) {
      case "Start":
        return "text-yellow-500"; // Yellow for Start
      case "Process":
        return "text-blue-500"; // Blue for Process
      case "Testing":
        return "text-purple-500"; // Purple for Testing
      case "Deployment":
        return "text-red-500"; // Red for Deployment
      case "Finish":
        return "text-green-500"; // Green for Finish
      default:
        return "text-gray-500"; // Gray for default
    }
  };

  // Function to get background color based on status (For animation)
  const getStatusLineColor = (status) => {
    switch (status) {
      case "Start":
        return "bg-yellow-500"; // Yellow for Start
      case "Process":
        return "bg-blue-500"; // Blue for Process
      case "Testing":
        return "bg-purple-500"; // Purple for Testing
      case "Deployment":
        return "bg-red-500"; // Red for Deployment
      case "Finish":
        return "bg-green-500"; // Green for Finish
      default:
        return "bg-gray-300"; // Gray for default
    }
  };

  // Function to get progress percentage based on status
  const getProgressPercentage = (status) => {
    switch (status) {
      case "Start":
        return "20%";
      case "Process":
        return "40%";
      case "Testing":
        return "60%";
      case "Deployment":
        return "80%";
      case "Finish":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show loading spinner if data is still loading */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        // Grid for medium and large screens when data is fetched
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
            >
              {/* Project Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {item.projectname}
                </h1>

                {/* Display Stage with text color */}
                <h2 className={`${getStatusClass(item.stage)} text-lg font-semibold mb-4`}>
                  {item.stage}
                </h2>

                {/* Status Line with animation */}
                <div className="relative mt-4 w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`${getStatusLineColor(
                      item.stage
                    )} status-line absolute left-0 top-0 h-full rounded-full transition-all duration-1000`}
                    style={{
                      width: getProgressPercentage(item.stage),
                    }}
                  ></div>
                </div>

                {/* Project Details */}
                <div className="mt-6 text-md text-gray-700">
                  <div className="mb-3">
                    <strong className="block text-gray-600">Project Lead:</strong>
                    <span className="text-gray-800">{getProjectLead(item.projectname)}</span>
                  </div>
                  <div className="mb-3">
                    <strong className="block text-gray-600">Project TEAM(s):</strong>
                    <span className="text-gray-800">{item.plname.join(", ")}</span>
                  </div>
                  <div className="mb-3">
                    <strong className="block text-gray-600">Duration:</strong>
                    <span className="text-gray-800">{item.duration} month</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-sm text-gray-500">
                  <div className="mb-2">
                    <strong>Register Date:</strong> {item.registerdate}
                  </div>
                  <div>
                    <strong>Created On:</strong>{" "}
                    {new Date(item.dateCreated).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Visual Decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-opacity-20 bg-gray-300 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-opacity-20 bg-gray-300 rounded-tr-full"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;