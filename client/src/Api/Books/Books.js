
import axios from 'axios'

const url = '/api';

export const fetchBooks = async (search = '') => {    
    const token = await sessionStorage.getItem("userToken")
    try{
        const res = await axios.get(`${url}/books/`+search, {
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

export const createBook = async (book) => {
    const token = await sessionStorage.getItem("userToken")
    const {projectname, codinglanguage,databasename,duration,registerdate,description} = book
    try{
        const data = await axios.post(`${url}/books`, {
            projectname, codinglanguage,databasename,duration,registerdate,description
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

export const editBook = async (book) => {
    const token = await sessionStorage.getItem("userToken")
    const {projectname, codinglanguage,databasename,duration,registerdate,description, id} = book
    try{
        const data = await axios.put(`${url}/books/`+id, {
            projectname, codinglanguage,databasename,duration,registerdate,description
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

export const deleteBook = async (book) => {
    const token = await sessionStorage.getItem("userToken")
    const {id} = book;
    try{
        const data = await axios.delete(`${url}/books/`+id, {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        })
        return data;
    }catch(error){
        return error.response;
    }
}
