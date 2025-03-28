import React, { useEffect, useState } from "react";
import axios from "axios";

const LeadStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [TL, setTL] = useState([]);
  const [datas, setDatas] = useState('');
  console.log(TL, "rlknklwrnlkrnklfnkn")

  // Fetch project lead data
  const getTL = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/create"
      );
      setTL(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch project status data
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/get-status"
      );
      setData(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getData();
        await getTL();
        
        const userData = sessionStorage.getItem('user');
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            setDatas(parsedData.username);
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
  
    fetchData();
  }, []);

  // Function to get the project lead for a specific project
  const getProjectLead = (projectname) => {
    const projectLead = TL.find((item) => item.projectname === projectname);
    return projectLead ? projectLead.plname : "No Lead Assigned";
  };

  // Filter projects where the current user is the project lead
  const filteredProjects = data.filter((item) => {
    const projectLead = TL.find((tlItem) => tlItem.projectname === item.projectname);
    return projectLead && projectLead.plname === datas;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Start":
        return "text-yellow-500";
      case "Process":
        return "text-blue-500";
      case "Testing":
        return "text-purple-500";
      case "Deployment":
        return "text-red-500";
      case "Finish":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLineColor = (status) => {
    switch (status) {
      case "Start":
        return "bg-yellow-500";
      case "Process":
        return "bg-blue-500";
      case "Testing":
        return "bg-purple-500";
      case "Deployment":
        return "bg-red-500";
      case "Finish":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

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
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-600">
                No projects assigned to you as lead.
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProjects.map((item, i) => (
                <div
                  key={i}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.projectname}
                    </h1>

                    <h2 className={`${getStatusClass(item.stage)} text-lg font-semibold mb-4`}>
                      {item.stage}
                    </h2>

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

                  <div className="absolute top-0 right-0 w-16 h-16 bg-opacity-20 bg-gray-300 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-opacity-20 bg-gray-300 rounded-tr-full"></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadStatus;