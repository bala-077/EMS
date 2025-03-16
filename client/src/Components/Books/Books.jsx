import React, { useState, useEffect } from 'react'
import {
  Paper,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  DialogTitle,
  Dialog,
  DialogContent,
  FormControl,
  DialogActions,
  DialogContentText,
  TableBody,
  Container,
  Button,
  CircularProgress,
} from '@material-ui/core'
import styles from './Books.module.css'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import { useForm } from './../../Custom-Hook/userForm'
import {
  fetchBooks,
  createBook,
  editBook,
  deleteBook,
} from './../../Api/Books/Books'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
import { formatDate } from './../../Tools/Tools'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'
import { debounce } from 'lodash'

function Books() {
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [projects, setBooks] = useState([])
  const [alert, setAlert] = useState('')
  const [errorAlert, setErrorAlert] = useState('')
  const [processing, setProcessing] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)

  const history = useHistory()

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

  const [bookForm, handleChange, setBookForm] = useForm({
    projectname: '',
    codinglanguage: '',
    databasename: '',
    duration: '',
    registerdate: '',
    description: '',
  })

  useEffect(() => {
    let isCancelled = false

    const fetchApi = async () => {
      setLoading(true)
      let booksData = await fetchBooks()
      if (!isCancelled) {
        setBooks(booksData)
        setLoading(false)
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
      setLoading(false)
    }

    return () => (isCancelled = true)
  }, [])

  const addBook = async (e) => {
    e.preventDefault()
    setProcessing(true)
    const res = isEdit ? await editBook(bookForm) : await createBook(bookForm)
    if (res.status === 200 || res.status === 201) {
      setCreateModal(false)
      if (isEdit) {
        setBooks(
          projects.map((book) => (book.id === res.data.id ? res.data : book))
        )
        setAlert(<Alert severity="success">Successfully edited book.</Alert>)
      } else {
        setBooks([res.data, ...projects])
        setAlert(<Alert severity="success">Successfully added new book.</Alert>)
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

  const destroyBook = async () => {
    setProcessing(true)
    const res = await deleteBook(bookForm)
    if (res.status === 200 || res.status === 204) {
      setProcessing(false)
      setDeleteAlert(false)
      setBooks(projects.filter((book) => book.id !== bookForm.id))
      setBookForm({
        projectname: '',
        codinglanguage: '',
        databasename: '',
        duration: '',
        registerdate: '',
        description: '',
        dateCreated: '',
      })
      setErrorAlert(
        <Alert style={{ textTransform: 'capitalize' }} severity="error">
          You Have Successfully Delete Book.
        </Alert>
      )
      setTimeout(() => {
        setErrorAlert('')
      }, 10000)
    }
  }

  const searchChange = debounce(async (text) => {
    setLoading(true)
    let isCancelled = false

    let booksData = await fetchBooks(text)
    if (!isCancelled) {
      setBooks(booksData)
      setLoading(false)
    }

    return () => (isCancelled = true)
  }, 1500)

  // Add the dialogs properly here:
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setBookForm({
          projectname: '',
          codinglanguage: '',
          databasename: '',
          duration: '',
          registerdate: '',
          description: '',
          dateCreated: '',
        })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={addBook} method="post">
        <Container>
          <DialogTitle className="mt-2">
            {isEdit ? 'Edit' : 'Add'} Project
          </DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="projectname"
                onChange={handleChange}
                value={bookForm.projectname}
                label="Project Name"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="codinglanguage"
                onChange={handleChange}
                value={bookForm.codinglanguage}
                label="Coding Language"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="databasename"
                onChange={handleChange}
                value={bookForm.databasename}
                label="Database Name"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="duration"
                onChange={handleChange}
                value={bookForm.duration}
                label="Duration"
                type="text"
                fullWidth
              />
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="registerdate"
                onChange={handleChange}
                value={bookForm.registerdate}
                label="Register Date"
                type="date"
                InputLabelProps={{ shrink: true }} // Ensures label stays visible
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="description"
                onChange={handleChange}
                value={bookForm.description}
                label="Description"
                multiline
                rows={4} // Adjust number of rows as needed
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
          setBookForm({
            projectname: '',
            codinglanguage: '',
            databasename: '',
            duration: '',
            registerdate: '',
            description: '',
          })
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
            Are you sure you want to delete <strong>{bookForm.projectname}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              destroyBook()
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
              setBookForm({
                projectname: '',
                codinglanguage: '',
                databasename: '',
                duration: '',
                registerdate: '',
                description: '',
              })
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
            <div className={styles.w60}>
              <TextField
                fullWidth
                id="standard-basic"
                onChange={(e) => searchChange(e.target.value)}
                label="Find Project..."
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="row-reverse" justify="flex-start" alignItems="center" spacing={2}>
              <Grid item xs={4}>
                {userType === 'admin' && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.btnAdd}
                    endIcon={<AddIcon />}
                    onClick={() => {
                      setIsEdit(false)
                      setCreateModal(true)
                    }}
                    fullWidth
                  >
                    Add Project
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {alert}
        <Grid container style={{ marginTop: '30px' }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ProjectName</TableCell>
                    <TableCell>CodingLanguage</TableCell>
                    <TableCell>Databasename</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>RegisterDate</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date Created</TableCell>
                    {userType === 'admin' && <TableCell align="center">Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.projectname}</TableCell>
                        <TableCell>{book.codinglanguage}</TableCell>
                        <TableCell>{book.databasename}</TableCell>
                        <TableCell>{book.duration}</TableCell>
                        <TableCell>{book.registerdate}</TableCell>
                        <TableCell>{book.description}</TableCell>
                        <TableCell>{formatDate(book.dateCreated)}</TableCell>
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
                                setBookForm(book)
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
                                setBookForm(book)
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

export default Books
