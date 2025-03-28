import React, { createContext, useState } from 'react';

export const userData = createContext();

const UserContext = ({ children }) => {
    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    console.log(username, "this user context username")
    console.log(data, "this is userCONTEXT")

    return (
        <userData.Provider value={{ data, setData, username, setUsername }}>
            {children} 
        </userData.Provider>
    );
};

export default UserContext;
