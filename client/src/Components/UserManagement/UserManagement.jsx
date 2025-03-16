import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  Container,
  Button,
  TableContainer,
  Paper,
  DialogContentText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'
import { formatDate } from './../../Tools/Tools'
import { useForm } from './../../Custom-Hook/userForm'
import { fetchUsers, createUser, editUser, deleteUser } from './../../Api/Users/Users'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
import CircularProgress from '@material-ui/core/CircularProgress'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
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
  const [loading, setLoading] = useState(true)  // Loading state for fetching users
  const [searchQuery, setSearchQuery] = useState('')

  const history = useHistory()

  // Fetching user data and handling token
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

  // Fetch users and set them to state
  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await fetchUsers()
      if (!isCancelled) {
        setUsers(res)
        setFilteredUsers(res)  // Initially, no filtering
        setLoading(false)  // Data is loaded
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [])

  // Handle search query and filter users
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

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

  // Dialogs (Add/Edit, Delete)
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setUserForm({
          name: '',
          username: '',
          password: '',
          userType: 'Project Manager',
        })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={registerUser} method="post">
        <Container>
          <DialogTitle className="mt-2">
            {isEdit ? 'Edit' : 'Add'} User
          </DialogTitle>
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
                name="username"
                onChange={handleChange}
                value={userForm.username}
                label="Username"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="password"
                onChange={handleChange}
                value={userForm.password}
                label="Password"
                type="password"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                id="standard-select-currency-native"
                select
                label="Select User Type:"
                name="userType"
                value={userForm.userType}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="admin">Admin</option>
                <option value="PM">Project Manager</option>
                <option value="PL">Project Leader</option>
                <option value="PD">Project Developer</option>
              </TextField>
            </FormControl>
          </Container>
        </DialogContent>

        <DialogActions>
          <Container>
            {!isEdit ? (
              <Button
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
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                endIcon={<SaveIcon />}
                disabled={processing}
                size="large"
                fullWidth
                type="submit"
              >
                Save
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
          setUserForm({ username: '', name: '', password: '', userType:'' })
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Find User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              style={{
                background: '#27ae60',
                width: '30%',
                float: 'right',
                marginTop: '13px',
              }}
              endIcon={<AddIcon />}
              onClick={() => {
                setCreateModal(true)
              }}
              fullWidth
            >
              Add User
            </Button>
          </Grid>
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
                    <TableCell>Date Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.userType}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{formatDate(user.dateCreated)}</TableCell>
                        {userType === 'admin' && (
                          <TableCell align="center">
                            <EditIcon
                              style={{
                                color: '#27ae60',
                                marginLeft: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setIsEdit(true)
                                setUserForm(user)
                                setCreateModal(true)
                              }}
                            />
                            <DeleteIcon
                              style={{
                                color: '#e74c3c',
                                marginLeft: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setUserForm(user)
                                setDeleteAlert(true)
                              }}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
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

export default UserManagement
