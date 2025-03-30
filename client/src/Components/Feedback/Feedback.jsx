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
  Tooltip,
  Breadcrumbs,
  Link,
  Box,
  Avatar,
  Chip,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import FeedbackIcon from "@material-ui/icons/Feedback";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "./../../Custom-Hook/userForm";
import { checkToken, fetchTaskUsers } from "./../../Api/Users/Users";
import { useHistory } from "react-router-dom";
import axios from "axios";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarHalfIcon from "@material-ui/icons/StarHalf";

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
    textTransform: "none",
    marginLeft: theme.spacing(1),
  },
  formControl: {
    minWidth: "100%",
    margin: theme.spacing(1, 0),
  },
  starRating: {
    display: "inline-block",
    marginTop: theme.spacing(1),
  },
  star: {
    cursor: "pointer",
    fontSize: "24px",
    marginRight: theme.spacing(0.5),
  },
  ratingText: {
    display: "block",
    marginTop: theme.spacing(0.5),
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  breadcrumbs: {
    marginBottom: theme.spacing(2),
  },
  clickableProject: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "none",
    },
  },
  disabledProject: {
    color: theme.palette.text.disabled,
    cursor: "not-allowed",
  },
  summaryContainer: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  skillRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  skillName: {
    width: "150px",
    fontWeight: 500,
  },
  ratingBar: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    height: "10px",
    backgroundColor: theme.palette.grey[300],
    borderRadius: "5px",
    overflow: "hidden",
  },
  ratingFill: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
  },
  averageRating: {
    width: "50px",
    textAlign: "right",
  },
  developerHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  developerAvatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  projectChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

const StarRating = ({ value = 0, onChange, className, readOnly = false }) => {
  const classes = useStyles();

  const renderStar = (star) => {
    if (readOnly) {
      if (value >= star) {
        return (
          <StarIcon className={classes.star} style={{ color: "#ffc107" }} />
        );
      } else if (value >= star - 0.5) {
        return (
          <StarHalfIcon className={classes.star} style={{ color: "#ffc107" }} />
        );
      } else {
        return (
          <StarBorderIcon
            className={classes.star}
            style={{ color: "#e4e5e9" }}
          />
        );
      }
    } else {
      return (
        <span
          key={star}
          className={classes.star}
          style={{
            color: star <= value ? "#ffc107" : "#e4e5e9",
          }}
          onClick={() => onChange(star)}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffc107")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color =
              star <= value ? "#ffc107" : "#e4e5e9")
          }
        >
          ★
        </span>
      );
    }
  };

  return (
    <div className={`${classes.starRating} ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => renderStar(star))}
      {!readOnly && (
        <span className={classes.ratingText}>
          {value ? `${value} star${value !== 1 ? "s" : ""}` : "Not rated"}
        </span>
      )}
    </div>
  );
};

const FeedbackDialog = React.memo(
  ({ open, onClose, selectedUser, selectedProject, onSubmit, processing }) => {
    const classes = useStyles();
    const [feedback, setFeedback] = useState({
      skills: Array(SKILLS.length).fill(0),
      overallReview: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorAlert, setErrorAlert] = useState(null);

    const handleSkillChange = (index, value) => {
      setFeedback((prev) => ({
        ...prev,
        skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
      }));
    };

    const handleOverallReviewChange = (e) => {
      setFeedback((prev) => ({ ...prev, overallReview: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!selectedUser || !selectedProject) {
        setErrorAlert(
          <Alert severity="error">No user or project selected</Alert>
        );
        return;
      }

      if (feedback.skills.some((skill) => skill === 0)) {
        setErrorAlert(
          <Alert severity="error">
            Please rate all skills before submitting
          </Alert>
        );
        return;
      }

      if (!feedback.overallReview.trim()) {
        setErrorAlert(
          <Alert severity="error">Please provide an overall review</Alert>
        );
        return;
      }

      await onSubmit(feedback);
      setIsSubmitted(true);
    };

    useEffect(() => {
      if (errorAlert) {
        const timer = setTimeout(() => setErrorAlert(null), 5000);
        return () => clearTimeout(timer);
      }
    }, [errorAlert]);

    if (!selectedUser || !selectedProject) {
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Alert severity="error">No user or project selected</Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Dialog
        open={open}
        onClose={() => {
          setErrorAlert(null);
          setIsSubmitted(false);
          onClose();
        }}
        scroll="body"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className={classes.modalTitle}>
          Feedback for {selectedUser?.name || "User"} on{" "}
          {selectedProject?.projectname || "Project"}
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          {isSubmitted ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={4}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Rating Successfully Completed!
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                Your feedback has been submitted successfully.
              </Typography>
              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {errorAlert && (
                  <Grid item xs={12}>
                    {errorAlert}
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Project: {selectedProject?.projectname || "Project"}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Developer: {selectedUser?.name || "User"}
                  </Typography>
                </Grid>

                {SKILLS.map((skill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FormControl component="fieldset" fullWidth>
                      <Typography variant="subtitle1" gutterBottom>
                        {skill}
                      </Typography>
                      <StarRating
                        value={feedback.skills[index] || 0}
                        onChange={(value) => handleSkillChange(index, value)}
                      />
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
                    placeholder="Provide your overall feedback about this developer's performance..."
                  />
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  onClick={() => {
                    setErrorAlert(null);
                    onClose();
                  }}
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
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

const FeedbackSummary = ({ summary, onClose }) => {
  const classes = useStyles();

  if (!summary) return null;

  return (
    <div className={classes.summaryContainer}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Feedback Summary</Typography>
        <Button onClick={onClose} size="small">
          Close
        </Button>
      </Box>
      <Divider style={{ margin: "16px 0" }} />

      <Typography variant="subtitle1" gutterBottom>
        Average Ratings
      </Typography>

      {Object.entries(summary.skills || {}).map(([skill, data]) => (
        <div key={skill} className={classes.skillRow}>
          <div className={classes.skillName}>{skill}</div>
          <div className={classes.ratingBar}>
            <div
              className={classes.ratingFill}
              style={{ width: `${((data.average || 0) / 5) * 100}%` }}
            />
          </div>
          <div className={classes.averageRating}>
            {(data.average || 0).toFixed(1)}
            <StarIcon
              style={{ color: "#ffc107", fontSize: "16px", marginLeft: "4px" }}
            />
          </div>
        </div>
      ))}

      <Box mt={2}>
        <Typography variant="body2">
          <strong>Total Feedbacks:</strong> {summary.totalFeedbacks || 0}
        </Typography>
        <Typography variant="body2">
          <strong>Last Feedback:</strong>{" "}
          {summary.lastFeedback
            ? new Date(summary.lastFeedback).toLocaleDateString()
            : "N/A"}
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>
          Feedback Received On Projects
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {Object.entries(summary.projects || {}).map(
            ([projectId, project]) => (
              <Chip
                key={projectId}
                label={`${project.name || "Project"} (${project.count || 0})`}
                className={classes.projectChip}
              />
            )
          )}
        </Box>
      </Box>
    </div>
  );
};

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
  const [errorAlert, setErrorAlert] = useState(null);
  const [alert, setAlert] = useState(null);
  const [userType, setUserType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [TL, setTL] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("projects");
  const [currentProject, setCurrentProject] = useState(null);
  const [userFeedbackSummary, setUserFeedbackSummary] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [loggedUser, setLoggedUser] = useState();
  const [allData, setAllData] = useState([]);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});

  // API call functions
  const getTL = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/allocate/get-allocation`
      );
      setTL(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching team leads:", err);
      setErrorAlert(
        <Alert severity="error">Failed to fetch team allocation data</Alert>
      );
    }
  }, []);

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allocate/get-status`);
      setProjects(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setErrorAlert(<Alert severity="error">Failed to fetch projects</Alert>);
      setProjects([]);
    }
  }, []);

  const getFeedback = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAllData(response.data || []);
      console.log(response.data, "ekhkjedhjehjk")
      
      // Update submittedFeedbacks state
      const feedbackStatus = {};
      response.data.forEach(feedback => {
        feedbackStatus[`${feedback.userId}-${feedback.projectId}`] = true;
      });
      setSubmittedFeedbacks(feedbackStatus);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setErrorAlert(
        <Alert severity="error">Failed to fetch feedback data</Alert>
      );
    }
  };

  const getTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allocate/get-task`);
      setTasks(response.data?.data || []);
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

  const fetchUserFeedbackSummary = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/user/${userId}/summary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserFeedbackSummary(response.data || null);
      setSelectedDeveloper(userId);
    } catch (err) {
      console.error("Error fetching feedback summary:", err);
      setErrorAlert(
        <Alert severity="error">Failed to load feedback summary</Alert>
      );
    }
  }, []);

  const handleFeedbackSubmit = useCallback(
    async (feedbackData) => {
      setProcessing(true);
      setErrorAlert(null);

      if (!selectedUser?.id || !selectedProject?._id) {
        setErrorAlert(
          <Alert severity="error">No user or project selected</Alert>
        );
        setProcessing(false);
        return;
      }

      try {
        const formattedSkills = SKILLS.map((skill, index) => ({
          skillName: skill,
          rating: feedbackData.skills[index] || 0,
        }));

        const completeData = {
          userId: selectedUser.id,
          userName: selectedUser.name || "Unknown User",
          projectId: selectedProject._id,
          projectName: selectedProject.projectname || "Unknown Project",
          skills: formattedSkills,
          reviewedBy: loggedUser,
          overallReview: feedbackData.overallReview || "",
        };

        const res = await axios.post(
          `${API_BASE_URL}/feedback/submit`,
          completeData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          // Update allData with new feedback
          setAllData(prevData => [...prevData, res.data]);
          
          // Update userFeedbackSummary immediately
          const newFeedback = res.data;
          if (userFeedbackSummary?.userId === selectedUser.id) {
            const updatedSummary = {
              ...userFeedbackSummary,
              totalFeedbacks: (userFeedbackSummary.totalFeedbacks || 0) + 1,
              lastFeedback: new Date(),
              skills: {
                ...userFeedbackSummary.skills,
                ...formattedSkills.reduce((acc, skill) => {
                  if (!acc[skill.skillName]) {
                    acc[skill.skillName] = { total: 0, count: 0, average: 0 };
                  }
                  acc[skill.skillName].total += skill.rating;
                  acc[skill.skillName].count += 1;
                  acc[skill.skillName].average = acc[skill.skillName].total / acc[skill.skillName].count;
                  return acc;
                }, {})
              }
            };
            setUserFeedbackSummary(updatedSummary);
          } else {
            // If no existing summary, create a new one
            const newSummary = {
              userId: selectedUser.id,
              totalFeedbacks: 1,
              lastFeedback: new Date(),
              skills: formattedSkills.reduce((acc, skill) => {
                acc[skill.skillName] = {
                  total: skill.rating,
                  count: 1,
                  average: skill.rating
                };
                return acc;
              }, {})
            };
            setUserFeedbackSummary(newSummary);
          }

          setAlert(
            <Alert severity="success">Feedback submitted successfully!</Alert>
          );
          setFeedbackModalOpen(false);
        }
      } catch (err) {
        console.error(
          "Feedback submission error:",
          err.response?.data || err.message
        );
        setErrorAlert(
          <Alert severity="error">
            {err.response?.data?.message ||
              "Failed to submit feedback. Please try again."}
          </Alert>
        );
      } finally {
        setProcessing(false);
      }
    },
    [selectedUser, selectedProject, userFeedbackSummary, loggedUser]
  );

  const loginUser = () => {
    const result = sessionStorage.getItem("user");

    if (result) {
      const { username } = JSON.parse(result); // Parse the JSON string before destructuring
      setLoggedUser(username);
    } else {
      console.log("No user found in sessionStorage");
    }
  };

  console.log(loggedUser, "loggeduser");

  const registerUser = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const taskData = {
        userId: userForm.userId || "",
        plname: userForm.username || "",
        type: userForm.userType || "Project Leader",
        taskDate: userForm.taskdate || "",
        desc: userForm.taskdesc || "",
        status: userForm.status || "Pending",
      };

      const res = await axios.post(
        `${API_BASE_URL}/allocate/create-task`,
        taskData
      );

      if (res.status === 200 || res.status === 201) {
        setCreateModal(false);
        if (isEdit) {
          setUsers(
            users.map((user) => (user.id === res.data.id ? res.data : user))
          );
          setAlert(<Alert severity="success">Successfully edited Task.</Alert>);
        } else {
          setUsers([res.data, ...users]);
          setAlert(
            <Alert severity="success">Successfully added new Task.</Alert>
          );
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

  const handleProjectClick = (project) => {
    if (project?.stage === "Finish") {
      setCurrentProject(project);
      setView("developers");
      setUserFeedbackSummary(null);
      setSelectedDeveloper(null);
    }
  };

  const handleBackToProjects = () => {
    setView("projects");
    setCurrentProject(null);
    setUserFeedbackSummary(null);
    setSelectedDeveloper(null);
  };

  const closeFeedbackSummary = () => {
    setUserFeedbackSummary(null);
    setSelectedDeveloper(null);
  };

  // Update useEffect to use allData for checking feedback status
  useEffect(() => {
    if (currentProject && users.length > 0 && allData.length > 0) {
      const feedbackStatus = {};
      users.forEach(user => {
        if (currentProject.plname.includes(user.name)) {
          // Check if feedback exists in allData
          const hasFeedback = allData.some(
            feedback => 
              feedback.userId === user.id && 
              feedback.projectId === currentProject._id &&
              feedback.reviewedBy === loggedUser
          );
          feedbackStatus[`${user.id}-${currentProject._id}`] = hasFeedback;
        }
      });
      setSubmittedFeedbacks(feedbackStatus);
    }
  }, [currentProject, users, allData, loggedUser]);

  // Component lifecycle
  useEffect(() => {
    getFeedback();
    loginUser();
    const fetchData = async () => {
      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) {
          history.push("/");
        } else {
          setUserType(res.data?.userType || null);
          await Promise.all([getTL(), getProjects(), getTasks(), getUsers()]);
        }
      } catch (e) {
        console.error("Initialization error:", e);
        setErrorAlert(
          <Alert severity="error">Failed to initialize data</Alert>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [history, getTL, getProjects, getTasks, getUsers]);

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

          <Breadcrumbs className={classes.breadcrumbs}>
            {view === "developers" && (
              <Link
                color="inherit"
                onClick={handleBackToProjects}
                style={{ cursor: "pointer" }}
              >
                Projects
              </Link>
            )}
            <Typography color="textPrimary">
              {view === "projects"
                ? "Projects"
                : currentProject?.projectname || "Project"}
            </Typography>
          </Breadcrumbs>

          {view === "projects" ? (
            <>
              <Typography variant="h5" gutterBottom>
                Projects
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell style={{ color: "white" }}>
                        Project Name
                      </TableCell>
                      <TableCell style={{ color: "white" }}>Status</TableCell>
                      <TableCell style={{ color: "white" }}>
                        Developers
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project?._id || Math.random()}
                        hover
                        className={
                          project?.stage === "Finish"
                            ? classes.clickableProject
                            : classes.disabledProject
                        }
                        onClick={() => handleProjectClick(project)}
                      >
                        <TableCell>
                          {project?.projectname || "Unnamed Project"}
                          {project?.stage !== "Finish" && (
                            <Tooltip title="Feedback only available for finished projects">
                              <span></span>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>{project?.stage || "Unknown"}</TableCell>
                        <TableCell>
                          {project?.plname && Array.isArray(project.plname)
                            ? project.plname.join(", ")
                            : "No developers assigned"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <div className={classes.developerHeader}>
                <Avatar className={classes.developerAvatar}>
                  {currentProject?.projectname?.charAt(0) || "P"}
                </Avatar>
                <div>
                  <Typography variant="h5">
                    Developers in {currentProject?.projectname || "Project"}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {currentProject?.stage || "Stage"} •{" "}
                    {currentProject?.plname?.length || 0} developers
                  </Typography>
                </div>
              </div>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell style={{ color: "white" }}>Name</TableCell>
                      <TableCell style={{ color: "white" }}>Role</TableCell>
                      <TableCell style={{ color: "white" }}>Rating</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .filter(
                        (user) =>
                          user &&
                          currentProject?.plname &&
                          Array.isArray(currentProject.plname) &&
                          currentProject.plname.includes(user.name)
                      )
                      .map((user) => (
                        <TableRow
                          key={user?.id || Math.random()}
                          hover
                          selected={selectedDeveloper === user?.id}
                          onClick={() =>
                            user?.id && fetchUserFeedbackSummary(user.id)
                          }
                        >
                          <TableCell>{user?.name || "Unknown User"}</TableCell>
                          <TableCell>{user?.userType || "Developer"}</TableCell>
                          <TableCell>
                            {userFeedbackSummary?.userId === user?.id ? (
                              <Box display="flex" alignItems="center">
                                <Typography
                                  variant="body1"
                                  style={{ marginRight: 8 }}
                                >
                                  {userFeedbackSummary?.skills &&
                                  Object.keys(userFeedbackSummary.skills)
                                    .length > 0
                                    ? (
                                        Object.values(
                                          userFeedbackSummary.skills
                                        ).reduce(
                                          (sum, skill) =>
                                            sum + (skill.average || 0),
                                          0
                                        ) /
                                        Object.keys(userFeedbackSummary.skills)
                                          .length
                                      ).toFixed(1)
                                    : "0.0"}
                                </Typography>

                                <StarRating
                                  value={
                                    userFeedbackSummary?.skills
                                      ? Object.values(
                                          userFeedbackSummary.skills
                                        ).reduce(
                                          (sum, skill) =>
                                            sum + (skill.average || 0),
                                          0
                                        ) /
                                        Object.keys(userFeedbackSummary.skills)
                                          .length
                                      : 0
                                  }
                                  readOnly
                                />
                              </Box>
                            ) : submittedFeedbacks[`${user?.id}-${currentProject?._id}`] ? (
                              <Typography variant="body1" color="primary">
                                Feedback submitted successfully
                              </Typography>
                            ) : (
                              "No feedback yet"
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              color="primary"
                              className={classes.feedbackButton}
                              startIcon={<FeedbackIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (user && currentProject) {
                                  setSelectedUser(user);
                                  setSelectedProject(currentProject);
                                  setFeedbackModalOpen(true);
                                } else {
                                  setErrorAlert(
                                    <Alert severity="error">
                                      Cannot provide feedback - missing data
                                    </Alert>
                                  );
                                }
                              }}
                              disabled={
                                submittedFeedbacks[
                                  `${user?.id}-${currentProject?._id}`
                                ]
                              }
                            >
                              {submittedFeedbacks[
                                `${user?.id}-${currentProject?._id}`
                              ]
                                ? "Feedback Submitted"
                                : "Give Feedback"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {userFeedbackSummary && (
                <FeedbackSummary
                  summary={userFeedbackSummary}
                  onClose={closeFeedbackSummary}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>

      <AddDialog />
      <FeedbackDialog
        open={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedUser(null);
          setSelectedProject(null);
        }}
        selectedUser={selectedUser}
        selectedProject={selectedProject}
        onSubmit={handleFeedbackSubmit}
        processing={processing}
      />
    </Container>
  );
}

export default FeedBack;
