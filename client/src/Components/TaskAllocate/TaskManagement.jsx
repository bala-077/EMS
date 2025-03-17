import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
  FormControl,
  DialogActions,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "./../../Custom-Hook/userForm";
import { checkToken, fetchTaskUsers } from "./../../Api/Users/Users";
import { useHistory } from "react-router-dom";

// Custom styles using makeStyles
const useStyles = makeStyles((theme) => ({
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  modalTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
  },
  modalContent: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}));

function TaskManagement() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [userForm, handleChange, setUserForm] = useForm({
    userId: "",
    username: "",
    userType: "Project Leader",
    taskdate: "",
    taskdesc: "",
    status: "Pending",
  });
  const [createModal, setCreateModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [userType, setUserType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const getTask = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/allocate/get-task");
      setTasks(response.data.data); // Store tasks in state
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchApi = async () => {
      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) {
          history.push("/");
        } else if (!isCancelled) {
          setUserType(res.data.userType);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
    return () => (isCancelled = true);
  }, [history]);

  useEffect(() => {
    getTask(); // Fetch tasks
    let isCancelled = false;
    const fetchApi = async () => {
      try {
        const res = await fetchTaskUsers();
        if (!isCancelled) {
          setUsers(res); // Set users in state
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
    return () => (isCancelled = true);
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const taskData = {
        userId: userForm.userId,
        plname: userForm.username,
        type: userForm.userType,
        taskDate: userForm.taskdate,
        desc: userForm.taskdesc,
        status: userForm.status || "Pending",
      };
      console.log("Sending payload:", taskData);

      const res = await axios.post("http://localhost:4000/api/allocate/create-task", taskData);

      console.log("Response from server:", res.data);

      if (res.status === 200 || res.status === 201) {
        setCreateModal(false);
        if (isEdit) {
          setUsers(users.map((user) => (user.id === res.data.id ? res.data : user)));
          setAlert(<Alert severity="success">Successfully edited Task.</Alert>);
        } else {
          setUsers([res.data, ...users]);
          setAlert(<Alert severity="success">Successfully added new Task.</Alert>);
        }
        getTask(); // Refresh tasks

        setTimeout(() => {
          setAlert("");
        }, 5000);
      } else {
        setErrorAlert(
          <Alert style={{ textTransform: "capitalize" }} severity="error">
            {res.data.error}
          </Alert>
        );
        setTimeout(() => {
          setErrorAlert("");
        }, 10000);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setErrorAlert(
        <Alert style={{ textTransform: "capitalize" }} severity="error">
          {err.response?.data?.error || err.message || "An error occurred."}
        </Alert>
      );
      setTimeout(() => {
        setErrorAlert("");
      }, 10000);
    }

    setProcessing(false);
  };

  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false);
        setUserForm({
          userId: "",
          username: "",
          userType: "Project Leader",
          taskdate: "",
          taskdesc: "",
          status: "Pending",
        });
      }}
      scroll="body"
      fullWidth
    >
      <DialogTitle className={classes.modalTitle}>
        {isEdit ? "Allocate Task" : "Add Task"}
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <form onSubmit={registerUser} method="post">
          <Container>
            {errorAlert}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                disabled
                InputProps={{
                  readOnly: true, // Correct way to set readonly
                }}
                name="name"
                onChange={handleChange}
                value={userForm.id}
                label="User ID"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="username"
                disabled // This maps to plname in the backend
                onChange={handleChange}
                value={userForm.username}
                label="Developer Name"
                type="text"
                fullWidth
                InputProps={{
                  readOnly: true, // Correct way to set readonly
                }}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="taskdate"
                onChange={handleChange}
                label="Task Date"
                type="date"
                value={userForm.taskdate || ""}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="taskdesc"
                onChange={handleChange}
                value={userForm.taskdesc || ""}
                label="Description"
                type="text"
                multiline
                rows={4}
                fullWidth
              />
            </FormControl>
          </Container>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCreateModal(false)}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              disabled={processing}
              className={classes.button}
            >
              {isEdit ? "Save Task" : "Add Task"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container>
      <Grid container style={{ marginTop: "30px" }}>
        <Grid item xs={12}>
          {alert}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  <TableCell style={{ color: "white" }}>Name</TableCell>
                  <TableCell style={{ color: "white" }}>Task Type</TableCell>
                  <TableCell style={{ color: "white" }}>Task Link</TableCell>
                  <TableCell style={{ color: "white" }}>Task Status</TableCell>
                  <TableCell style={{ color: "white" }}>Allocate Task</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className={classes.tableRow}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>
                      {tasks
                        .filter((task) => task.userId === user.id)
                        .map((task) =>
                          task.desc && (
                            <a
                              href={task.desc.startsWith("http") ? task.desc : `https://${task.desc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "blue", textDecoration: "underline" }}
                              key={task.id}
                            >
                              {task.desc}
                            </a>
                          )
                        )}
                    </TableCell>
                    <TableCell>
                      {tasks
                        .filter((task) => task.userId === user.id)
                        .map((task) => (
                          <div key={task.id}>{task.status || "Not Available"}</div>
                        ))}
                    </TableCell>
                    {userType === "PL" && (
                      <TableCell align="right">
                        <EditIcon
                          style={{
                            color: "#27ae60",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsEdit(true);
                            setUserForm(user);
                            setCreateModal(true);
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {addDialog}
    </Container>
  );
}

export default TaskManagement;