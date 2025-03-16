import React, { useState, useEffect } from 'react'

import {
  // Paper,
  Grid,
  TextField,
  Container,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  DialogActions,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { formatDate } from './../../Tools/Tools'
import { useForm } from './../../Custom-Hook/userForm'
import SaveIcon from '@material-ui/icons/Save'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {
  fetchTaskUsers,
  createUser,
  editUser,
  deleteUser,
} from './../../Api/Users/Users'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
//import { Feedback } from '@material-ui/icons'
import { makeStyles } from "@material-ui/core/styles";

function Feedback() {
  const [users, setUsers] = useState([])
  const [userForm, handleChange, setUserForm] = useForm({
    name: '',
    username: '',
    password: '',
    userType: '',
  })
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errorAlert, setErrorAlert] = useState('')
  const [alert, setAlert] = useState('')
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)
  const [ratings, setRatings] = useState({});
  const history = useHistory()
  
  

const useStyles = makeStyles({
  button: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1976d2", // Primary Blue
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    borderRadius: "0", // Makes it fit perfectly inside the table
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#135ba1", // Darker Blue on Hover
    },
  },
});

const classes = useStyles();
  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')

      if (!isCancelled) {
        setUserType(res.data.userType)
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }
    return () => (isCancelled = true)
  }, [history])




  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await fetchTaskUsers()
      if (!isCancelled) {
        setUsers(res)
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [])

  
  const registerUser = async (e) => {
    e.preventDefault()
    setProcessing(true)
    const res = isEdit ? await editUser(userForm) : await createUser(userForm)
   
    if (res.status === 200 || res.status === 201) {
      setCreateModal(false)
      if (isEdit) {
        setUsers(
          users.map((user) => (user.id === res.data.id ? res.data : user))
        )
        setAlert(<Alert severity="success">Successfully edited User.</Alert>)
      } else {
      setUsers([res.data, ...users])
      setAlert(<Alert severity="success">Successfully added new User.</Alert>)
      }
      setTimeout(() => {
        setAlert('')
      }, 5000)
    } else {
      setErrorAlert(
        <Alert style={{ textTransform: 'capitalize' }} severity="error">
          {res.data.error}
        </Alert>
      )
      setTimeout(() => {
        setErrorAlert('')
      }, 10000)
    }

    setProcessing(false)
  }
  const destroyUser = async () => {
    setProcessing(true)
    const res = await deleteUser(userForm)
    if (res.status === 200 || res.status === 204) {
      setProcessing(false)
      setDeleteAlert(false)
      setUsers(users.filter((user) => user.id !== userForm.id))
      setUserForm({ username: '', name: '', password:'',userType:''})
      setErrorAlert(
        <Alert style={{ textTransform: 'capitalize' }} severity="error">
          You Have Successfully Deleted User.
        </Alert>
      )
      setTimeout(() => {
        setErrorAlert('')
      }, 10000)
    }
  }

  //Dialogs
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setUserForm({
          name: '',
          username: '',
          password: '',
          userType: 'Project Leader',
        })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={registerUser} method="post">
        <Container>
          <DialogTitle className="mt-2">
          { isEdit ? 'Allocate' : 'Add'} 
            Task</DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="name"
                onChange={handleChange}
                value={userForm.name}
                label="Name"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
            <TextField
  required
  name="taskdate"
  onChange={handleChange}
  label="Task Date"
  type="date"
  value={userForm.taskdate || ""} // Ensure it has a default value
  fullWidth
  InputLabelProps={{ shrink: true }} // Ensures label stays above
/>

            </FormControl>
            <FormControl margin="normal" fullWidth>
            <TextField
  required
  name="taskdesc"
  onChange={handleChange}
  value={userForm.taskdesc || ""} // Ensure correct state variable
  label="Description"
  type="text"
  multiline
  rows={4} // Adjust as needed
  fullWidth
/>

            </FormControl>
            
          </Container>
        </DialogContent>

        <DialogActions>
          <Container>
            {!isEdit ? (
              <Button
                id="addBtn"
                variant="contained"
                color="primary"
                endIcon={<AddIcon />}
                disabled={processing}
                style={{ marginBottom: '20px' }}
                size="large"
                type="submit"
                fullWidth
              >
                Add
              </Button>
            ) : (
              <Button
                id="editBtn"
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                endIcon={<SaveIcon />}
                disabled={processing}
                size="large"
                fullWidth
                type="submit"
              >
                Allocate
              </Button>
            )}
          </Container>
        </DialogActions>



        
      </form>
    </Dialog>
  )
  const deleteDialog = (
    <div>
      <Dialog
        open={deleteAlert}
        onClose={() => {
          setUserForm({ username: '', name: '', password: '', userType:''})
          setDeleteAlert(false)
        }}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CancelOutlinedIcon
            style={{
              color: '#e74c3c',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
              display: 'block',
              fontSize: '250px',
            }}
          />
          <DialogContentText
            style={{ textAlign: 'center' }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete <strong>{userForm.username}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              destroyUser()
            }}
            disabled={processing}
            color="primary"
          >
            Proceed
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => {
              setUserForm({ username: '', name: '', password: '', userType:'' })
              setDeleteAlert(false)
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
  

  return (
    <div>
      <Container>
        <Grid container spacing={1}>
        
          
        </Grid>
        <Grid container style={{ marginTop: '30px' }}>
          <Grid item xs={12}>
            {alert}
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Username</TableCell>
                   
                   
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>{user.username}</TableCell>
                     
                      
                    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <table border="1" style={{ width: "100%", height: "30%" }}>
      <thead>
        <tr>
          <th style={{ width:"70%"}}><b>NUMERACY</b></th>
          <th>Very Good</th>
          <th>Good</th>
          <th>Adequate</th>
        </tr>
      </thead>
      <tbody>
        {[
          "Simple calculations",
          "More complex calculations",
          "Interpret graphs, Charts and Tables",
          "Prepare Graphs, charts and tables to convey information",
          "Presentations",
          "Problem-solving capability"
        ].map((skill, index) => (
          <tr key={index}>
            <td>{skill}</td>
            {[5, 4, 3].map((value) => (
              <td key={value}>
                <input
                  type="radio"
                  name={`r${index + 1}`} 
                  value={value}
                  checked={ratings[`r${index + 1}`] === String(value)}
                  onChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <table border="1" style={{ width: "100%", height: "30%" }}>
      <thead>
        <tr>
          <th style={{ width:"70%"}}><b>COMMUNICATION SKILLS</b></th>
          <th>Very Good</th>
          <th>Good</th>
          <th>Adequate</th>
        </tr>
      </thead>
      <tbody>
        {[
          "composing own letter",
          "Taking notes in meetings and minutes",
          "Explain complex things",
          "Lead a group discussion",
          "Creatively explaining the Presentations",
          "Gesture while explaining the project details"
        ].map((skill, index) => (
          <tr key={index}>
            <td>{skill}</td>
            {[5, 4, 3].map((value) => (
              <td key={value}>
                <input
                  type="radio"
                  name={`r${index + 1}`} 
                  value={value}
                  checked={ratings[`r${index + 1}`] === String(value)}
                  onChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>


    <table border="1" style={{ width: "100%", height: "30%" }}>
      <thead>
        <tr>
          <th style={{ width:"70%"}}><b>INFORMATION TECHNOLOGY</b></th>
          <th>Very Good</th>
          <th>Good</th>
          <th>Adequate</th>
        </tr>
      </thead>
      <tbody>
        {[
          "Microsoft office Word Usage",
          "Excel Spreadsheet Usage",
          "Database Usage",
          "Desktop publishing",
          "Update Intranet and internet pages",
          "E-mail Usage"
        ].map((skill, index) => (
          <tr key={index}>
            <td>{skill}</td>
            {[5, 4, 3].map((value) => (
              <td key={value}>
                <input
                  type="radio"
                  name={`r${index + 1}`} 
                  value={value}
                  checked={ratings[`r${index + 1}`] === String(value)}
                  onChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <table border="1" style={{ width: "100%", height: "30%" }}>
      <thead>
        <tr>
          <th style={{ width:"70%"}}><b>ERROR OCCURENCES IN TASK</b></th>
          <th>Very Good</th>
          <th>Good</th>
          <th>Adequate</th>
        </tr>
      </thead>
      <tbody>
        {[
          "Compile Error",
          "Runtime Error",
          "Capability of Solving Error",
          "Logical Error",
          "Update Intranet and internet pages",
          "Abstract Thinking to Solve Error"
        ].map((skill, index) => (
          <tr key={index}>
            <td>{skill}</td>
            {[5, 4, 3].map((value) => (
              <td key={value}>
                <input
                  type="radio"
                  name={`r${index + 1}`} 
                  value={value}
                  checked={ratings[`r${index + 1}`] === String(value)}
                  onChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <Table style={{ width: "100%", height: "100%" }}>
        <TableBody>
          <TableRow>
            <TableCell style={{ padding: 0 }}>
              <Button className={classes.button} onClick={() => alert("Form Submitted!")}>
                Submit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>


            </TableContainer>
          </Grid>
        </Grid>
        {addDialog}
        {deleteDialog}
      </Container>
    </div>
  )
}
export default Feedback;
