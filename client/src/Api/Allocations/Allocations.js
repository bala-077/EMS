import axios from 'axios';

const url = '/api';

// Helper function to get the token
const getToken = async () => {
  const token = await sessionStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  return token;
};

// Fetch all projects (formerly fetchBooks)
export const fetchBooks = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${url}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

// Fetch all developers (formerly fetchProjectDeveloper)
export const fetchProjectDeveloper = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${url}/developers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching developers:', error);
    return [];
  }
};

// Your plAllocate function for allocation
export const plAllocate = async (plAllocate) => {
  const {  projectname, codinglanguage, databasename, duration, registerdate, description, plname } = plAllocate;
  try {
    const token = await getToken();
    const response = await axios.post(
      `${url}/allocate/create`,
      {
        projectname,
        codinglanguage,
        databasename,
        duration,
        registerdate,
        description,
        plname,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error allocating project:', error.response || error);
    return { status: 500, error: error.response?.data?.error || 'Unknown Error' };
  }
};

// Update Project Developer (plname)
export const updateProjectDeveloper = async (projectId, newPlname) => {
  try {
    const token = await getToken();
    const response = await axios.put(`/api/projectallocate/${projectId}`, {
      plname: newPlname,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the updated project data
  } catch (error) {
    console.error('Error updating project developer:', error);
    return { status: 500, error: error.response?.data?.error || 'Unknown Error' };
  }
};

// Fetch All Allocated Projects
export const AllProject = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${url}/allocate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching allocated projects:', err);
    return [];
  }
};
