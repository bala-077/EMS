import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeveloperProject = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState('');
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/allocate/get-lead");
      setData(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUser = () => {
    try {
      const result = JSON.parse(sessionStorage.getItem("user"));
      if (result && result.username) {
        setUser(result.username);
      }
    } catch (err) {
      console.error("Error getting user:", err);
    }
  };

  useEffect(() => {
    getData();
    getUser();
  }, []);

  useEffect(() => {
    if (user && data.length > 0) {
      const matchedProjects = data.filter(project => 
        project.plname.includes(user)
      );
      setUserProjects(matchedProjects);
    }
  }, [user, data]);

  const getStageColor = (stage) => {
    switch (stage) {
      case "Start":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Process":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Testing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Deployment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Finish":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>Error: {error}</p>
        <button 
          onClick={getData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Projects</h2>
      
      {userProjects.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-gray-200">
          <p className="text-gray-700 text-lg">No projects assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <div 
              key={project._id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-100"
            >
              <div className={`flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white`}>
                <h3 className="text-xl font-semibold truncate">{project.projectname}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStageColor(project.stage)}`}>
                  {project.stage}
                </span>
              </div>
              
              <div className="p-5 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Languages</h4>
                    <p className="text-gray-900 font-medium">{project.codinglanguage}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Database</h4>
                    <p className="text-gray-900 font-medium">{project.databasename}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</h4>
                    <p className="text-gray-900 font-medium">{project.duration} months</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</h4>
                    <p className="text-gray-900 font-medium">
                      {new Date(project.registerdate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Team Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.plname.map((member, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member === user 
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperProject;