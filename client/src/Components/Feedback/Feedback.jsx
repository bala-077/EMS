import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  TextField,
  Container,
  Button,
  CircularProgress,
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
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import FeedbackIcon from "@material-ui/icons/Feedback";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "./../../Custom-Hook/userForm";
import { checkToken, fetchTaskUsers } from "./../../Api/Users/Users";
import { useHistory } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

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
  projectTable: {
    marginBottom: theme.spacing(4),
  },
  feedbackButton: {
    textTransform: 'none',
    marginLeft: theme.spacing(1),
  },
  formControl: {
    minWidth: '100%',
    margin: theme.spacing(1, 0),
  },
}));

const SKILLS = [
  "Communication",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Leadership",
  "Technical Skills",
  "Creativity",
  "Adaptability",
  "Project Management",
  "Critical Thinking",
  "Attention to Detail",
  "Organization",
  "Learning Ability",
  "Collaboration",
  "Initiative",
];

function FeedBack() {
  const classes = useStyles();
  const history = useHistory();
  
  // State declarations
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
  const [TL, setTL] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState({
    skills: Array(SKILLS.length).fill(""),
    overallReview: "",
    projectId: "",
  });

  // API call functions
  const getTL = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allocate/get-allocation`);
      setTL(response.data.data);
    } catch (err) {
      console.error("Error fetching team leads:", err);
      setErrorAlert(<Alert severity="error">Failed to fetch team allocation data</Alert>);
    }
  }, []);

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allocate/get-status`);
      setProjects(response.data.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setErrorAlert(<Alert severity="error">Failed to fetch projects</Alert>);
      setProjects([]);
    }
  }, []);

  const getTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allocate/get-task`);
      setTasks(response.data.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setErrorAlert(<Alert severity="error">Failed to fetch tasks</Alert>);
      setTasks([]);
    }
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const res = await fetchTaskUsers();
      setUsers(res || []);
    } catch (e) {
      console.error("Error fetching users:", e);
      setErrorAlert(<Alert severity="error">Failed to fetch users</Alert>);
      setUsers([]);
    }
  }, []);

  // Event handlers
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...feedback.skills];
    updatedSkills[index] = value;
    setFeedback({ ...feedback, skills: updatedSkills });
  };

  const handleOverallReviewChange = (e) => {
    setFeedback({ ...feedback, overallReview: e.target.value });
  };

  const handleProjectChange = (e) => {
    setFeedback({ ...feedback, projectId: e.target.value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const feedbackData = {
        userId: selectedUser.id,
        projectId: feedback.projectId,
        skills: feedback.skills,
        overallReview: feedback.overallReview,
      };
      
      const res = await axios.post(`${API_BASE_URL}/feedback/submit`, feedbackData);
      
      if (res.status === 200 || res.status === 201) {
        setAlert(<Alert severity="success">Feedback submitted successfully!</Alert>);
        setFeedbackModal(false);
        setFeedback({
          skills: Array(SKILLS.length).fill(""),
          overallReview: "",
          projectId: "",
        });
      }
    } catch (err) {
      setErrorAlert(
        <Alert severity="error">
          {err.response?.data?.message || "Failed to submit feedback"}
        </Alert>
      );
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setAlert("");
        setErrorAlert("");
      }, 5000);
    }
  };

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

      const res = await axios.post(`${API_BASE_URL}/allocate/create-task`, taskData);

      if (res.status === 200 || res.status === 201) {
        setCreateModal(false);
        if (isEdit) {
          setUsers(users.map((user) => (user.id === res.data.id ? res.data : user)));
          setAlert(<Alert severity="success">Successfully edited Task.</Alert>);
        } else {
          setUsers([res.data, ...users]);
          setAlert(<Alert severity="success">Successfully added new Task.</Alert>);
        }
        getTasks();
      }
    } catch (err) {
      setErrorAlert(
        <Alert severity="error">
          {err.response?.data?.error || err.message || "An error occurred."}
        </Alert>
      );
    } finally {
      setProcessing(false);
    }
  };

  // Component lifecycle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) {
          history.push("/");
        } else {
          setUserType(res.data.userType);
          await Promise.all([
            getTL(),
            getProjects(),
            getTasks(),
            getUsers()
          ]);
        }
      } catch (e) {
        console.error("Initialization error:", e);
        setErrorAlert(<Alert severity="error">Failed to initialize data</Alert>);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [history, getTL, getProjects, getTasks, getUsers]);

  // Dialog components
  const AddDialog = () => (
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
                name="userId"
                onChange={handleChange}
                value={userForm.userId}
                label="User ID"
                type="text"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="username"
                onChange={handleChange}
                value={userForm.username}
                label="Developer Name"
                type="text"
                fullWidth
                InputProps={{ readOnly: true }}
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

  const FeedbackDialog = () => (
    <Dialog
      open={feedbackModal}
      onClose={() => setFeedbackModal(false)}
      scroll="body"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className={classes.modalTitle}>
        Developer Feedback for {selectedUser?.name}
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <form onSubmit={handleFeedbackSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <TextField
                  select
                  value={feedback.projectId}
                  onChange={handleProjectChange}
                  required
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select a project</option>
                  {projects
                    .filter(project => 
                      project.plname && 
                      Array.isArray(project.plname) &&
                      project.plname.includes(selectedUser?.name)
                    )
                    .map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.projectname}
                      </option>
                    ))}
                </TextField>
              </FormControl>
            </Grid>
            
            {SKILLS.map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1">{skill}</Typography>
                  <RadioGroup
                    value={feedback.skills[index] || ""}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="Excellent"
                      control={<Radio color="primary" />}
                      label="Excellent"
                    />
                    <FormControlLabel
                      value="Good"
                      control={<Radio color="primary" />}
                      label="Good"
                    />
                    <FormControlLabel
                      value="Needs Improvement"
                      control={<Radio color="primary" />}
                      label="Needs Improvement"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <TextField
                label="Overall Review"
                value={feedback.overallReview}
                onChange={handleOverallReviewChange}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          
          <DialogActions>
            <Button
              onClick={() => setFeedbackModal(false)}
              color="secondary"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={processing}
              endIcon={processing ? <CircularProgress size={20} /> : null}
            >
              Submit Feedback
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
          {errorAlert}
          
          <Typography variant="h5" gutterBottom>Team Members</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>Name</TableCell>
                  <TableCell style={{ color: "white" }}>Role</TableCell>
                  <TableCell align="right" style={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        className={classes.feedbackButton}
                        startIcon={<FeedbackIcon />}
                        onClick={() => {
                          setSelectedUser(user);
                          setFeedbackModal(true);
                        }}
                      >
                        Feedback
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
      <AddDialog />
      <FeedbackDialog />
    </Container>
  );
}

export default FeedBack;