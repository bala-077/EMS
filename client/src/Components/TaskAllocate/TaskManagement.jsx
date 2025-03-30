import React, { useState, useEffect, useContext } from "react";
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
  DialogActions,
  CircularProgress,
  Typography,
  Snackbar,
  IconButton,
  Avatar,
  Chip,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "./../../Custom-Hook/userForm";
import { checkToken, fetchTaskUsers } from "./../../Api/Users/Users";
import { useHistory } from "react-router-dom";
import { userData } from "../context/userContext";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
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
    padding: theme.spacing(3),
  },
  modalContent: {
    padding: theme.spacing(4),
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
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  taskLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  roleChip: {
    marginLeft: theme.spacing(1),
  },
  statusChip: {
    marginRight: theme.spacing(1),
  },
}));

function TaskManagement() {
  const classes = useStyles();
  const { username } = useContext(userData);
  const [users, setUsers] = useState([]);
  const [userForm, handleChange, setUserForm] = useForm({
    userId: "",
    username: "",
    userType: "Project Leader",
    taskdate: "",
    taskdesc: "",
    status: "Pending",
    allocatedBy: username
  });
  const [createModal, setCreateModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [userType, setUserType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateError, setDateError] = useState("");

  const history = useHistory();

  const getTask = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/allocate/get-task");
      // Filter tasks to only show today's tasks
      const todayTasks = response.data.data.filter(task => {
        return moment(task.taskDate).isSame(moment(), 'day');
      });
      setTasks(todayTasks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setLoading(false);
      setAlert({
        open: true,
        message: "Failed to load tasks",
        severity: "error"
      });
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
          console.log("User type set to:", res.data.userType);
        }
      } catch (e) {
        console.error("Auth error:", e);
      }
    };
    fetchApi();
    return () => (isCancelled = true);
  }, [history]);

  useEffect(() => {
    getTask();
    let isCancelled = false;
    const fetchApi = async () => {
      try {
        const res = await fetchTaskUsers();
        if (!isCancelled) {
          setUsers(res);
        }
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };
    fetchApi();
    return () => (isCancelled = true);
  }, []);

  const checkTaskExists = (userId, date) => {
    return tasks.some(task => 
      task.userId === userId && 
      moment(task.taskDate).isSame(date, 'day')
    );
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Validate one task per day
    if (checkTaskExists(userForm.userId, userForm.taskdate)) {
      setDateError("This user already has a task assigned for this date");
      setProcessing(false);
      return;
    }

    try {
      const taskData = {
        userId: userForm.userId,
        plname: userForm.username,
        type: userForm.userType,
        taskDate: userForm.taskdate,
        desc: userForm.taskdesc,
        status: userForm.status || "Pending",
        allocatedBy: username,
      };

      const res = await axios.post("http://localhost:4000/api/allocate/create-task", taskData);

      if (res.status === 200 || res.status === 201) {
        setCreateModal(false);
        setAlert({
          open: true,
          message: isEdit ? "Task updated successfully" : "Task assigned successfully",
          severity: "success"
        });
        getTask();
        setUserForm({
          userId: "",
          username: "",
          userType: "Project Leader",
          taskdate: "",
          taskdesc: "",
          status: "Pending",
          allocatedBy: username
        });
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setAlert({
        open: true,
        message: err.response?.data?.error || err.message || "An error occurred",
        severity: "error"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDateError("");
    handleChange(e);
    
    if (userForm.userId && checkTaskExists(userForm.userId, date)) {
      setDateError("This user already has a task assigned for this date");
    }
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
          allocatedBy: username
        });
        setDateError("");
      }}
      scroll="body"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={classes.modalTitle}>
        {isEdit ? "Edit Task" : "Assign New Task"}
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <form onSubmit={registerUser} method="post">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                name="userId"
                value={userForm.userId}
                label="User ID"
                type="text"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="username"
                value={userForm.username}
                label="Developer Name"
                type="text"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="taskdate"
                onChange={handleDateChange}
                label="Task Date"
                type="date"
                value={userForm.taskdate || ""}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!dateError}
                helperText={dateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="taskdesc"
                onChange={handleChange}
                value={userForm.taskdesc || ""}
                label="Task Description"
                type="text"
                multiline
                rows={4}
                fullWidth
                placeholder="Enter task details or link"
              />
            </Grid>
          </Grid>
          <DialogActions className={classes.actionButtons}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setCreateModal(false);
                setDateError("");
              }}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={processing ? <CircularProgress size={20} /> : <AddIcon />}
              disabled={processing || !!dateError}
              className={classes.button}
            >
              {isEdit ? "Update Task" : "Assign Task"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <Container className={classes.root}>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Box className={classes.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management System
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {userType === "Project Leader" || userType === "PL" 
            ? "Manage your team's tasks for today"
            : "View your assigned tasks for today"}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {moment().format('dddd, MMMM Do YYYY')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell>Team Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const userTasks = tasks.filter(task => task.userId === user.id);
                  return (
                    <TableRow key={user.id} className={classes.tableRow} hover>
                      <TableCell>
                        <Box className={classes.userCell}>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                          <div>
                            <Typography>{user.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.userType}
                          color={user.userType === "Project Leader" ? "primary" : "default"}
                          size="small"
                          className={classes.roleChip}
                        />
                      </TableCell>
                      <TableCell>
                        {userTasks.map(task => (
                          <div key={task._id}>
                            {task.desc.startsWith("http") ? (
                              <a
                                href={task.desc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={classes.taskLink}
                              >
                                {task.desc}
                              </a>
                            ) : (
                              <Typography>{task.desc}</Typography>
                            )}
                            <Typography variant="caption" display="block">
                              {moment(task.taskDate).format('h:mm A')}
                            </Typography>
                          </div>
                        ))}
                        {userTasks.length === 0 && "No tasks assigned for today"}
                      </TableCell>
                      <TableCell>
                        {userTasks.map(task => (
                          <Chip
                            key={task._id}
                            label={task.status || "Pending"}
                            color={
                              task.status === "Completed" ? "primary" :
                              task.status === "In Progress" ? "secondary" : "default"
                            }
                            size="small"
                            className={classes.statusChip}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        {(userType === "Project Leader" || userType === "PL") && (
                          <Box display="flex" justifyContent="flex-end">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setIsEdit(true);
                                setUserForm({
                                  userId: user.id,
                                  username: user.name,
                                  userType: user.userType,
                                  taskdate: moment().format('YYYY-MM-DD'),
                                  taskdesc: "",
                                  status: "Pending",
                                  allocatedBy: username
                                });
                                setCreateModal(true);
                              }}
                              className={classes.actionButton}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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