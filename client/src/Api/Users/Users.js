
import axios from 'axios'

const url = '/api';

export const loginUser = async (login) => {
    const {username, password, usertype} = login 
    try{
        const data = await axios.post(`${url}/login`, {
            username,
            password,
            userType:usertype
        });
        return data;
    }catch(error){
        return error.response
    }
}       

export const checkToken = async () => {
    const userToken = await sessionStorage.getItem("userToken");
    try{
        const data = await axios.post(`${url}/login/me/`+userToken, {
        });
        return data;
    }catch(error){
        return error.response
    }
}  

export const fetchUsers = async () => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/users`, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
        });
        const {data} = res;
        return data;
    }catch(error){
        //return []
        return error.response
    }
}


export const fetchUser = async (id) => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/users/`+id, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
        });
        const {data} = res;
        return data;
    }catch(error){
        return []
        //return error.response
    }
}



export const createUser = async (user) => {
    const token = await sessionStorage.getItem("userToken")
    const {name, username, password, userType} = user
    try{
        const data = await axios.post(`${url}/users`, {
            name, username, password, userType
        }, {
            headers: {
                Authorization: 'Bearer' + token //the token is a variable which holds the token
            }
        })
        return data;
    }catch(error){
        return error.response;
    }
}

export const editUser = async (user) => {
    const token = await sessionStorage.getItem("userToken")
    const {name, username, password, userType, id} = user
    try{
        const data = await axios.put(`${url}/users/`+id, {
            name, username, password, userType
            }, {
                headers: {
                    Authorization: 'Bearer ' + token //the token is a variable which holds the token
                }
              })
        return data;
    }catch(error){
        return error.response;
    }
}




export const deleteUser = async (user) => {
    const token = await sessionStorage.getItem("userToken")
    const {id} = user;
    try{
        const data = await axios.delete(`${url}/users/`+id, {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        })
        return data;
    }catch(error){
        return error.response;
    }
}

export const fetchTeamLeader = async () => {    
    const token = await sessionStorage.getItem("userToken");

    try {
        const res = await axios.get(`${url}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 🔹 Ensure API returns users with a 'userType' field
        return res.data.filter(user => user.userType === "PL");

    } catch (error) {
        console.error("Error fetching team leaders:", error);
        return [];
    }
};


export const fetchProjectDeveloper = async () => {    
    const token = await sessionStorage.getItem("userToken");

    try {
        const res = await axios.get(`${url}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 🔹 Ensure API returns users with a 'userType' field
        return res.data.filter(user => user.userType === "PD");

    } catch (error) {
        console.error("Error fetching team leaders:", error);
        return [];
    }
};


export const fetchTaskUsers = async () => {    
    const token = await sessionStorage.getItem("userToken");

    try {
        const res = await axios.get(`${url}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 🔹 Ensure API returns users with a 'userType' field
        return res.data.filter(user => user.userType === "PD");

    } catch (error) {
        console.error("Error fetching team leaders:", error);
        return [];
    }
};




