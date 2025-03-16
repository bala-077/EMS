import React, { useState, useEffect } from "react";
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
  TableBody,
  Container,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { useForm } from "./../../Custom-Hook/userForm";
import { fetchProjectDeveloper } from "./../../Api/Users/Users";
import { fetchBooks } from "./../../Api/Books/Books";
import { checkToken } from "../../Api/Users/Users";
import { useHistory } from "react-router";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

function LeadAllocation() {
  const [editModal, setEditModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [processing, setProcessing] = useState(false);
  const [userType, setUserType] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const history = useHistory();
  const [TL, setTL] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);

  // State to track project stages
  const [projectStages, setProjectStages] = useState({});

  useEffect(() => {
    let isCancelled = false;

    const fetchApi = async () => {
      setLoadingProjects(true);
      setLoadingUsers(true);

      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) history.push("/");

        const usersData = await fetchProjectDeveloper();
        const booksData = await fetchBooks();

        if (!isCancelled) {
          setUserType(res.data.userType);
          setUsers(usersData);
          setProjects(booksData);

          // Initialize project stages
          const stages = {};
          booksData.forEach((book) => {
            stages[book._id] = book.stage || "Start"; // Default stage is "Start"
          });
          setProjectStages(stages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProjects(false);
        setLoadingUsers(false);
      }
    };

    fetchApi().catch(console.error);
    return () => (isCancelled = true);
  }, [history]);

  const [bookForm, handleChange, setBookForm] = useForm({
    projectId: "",
    projectname: "",
    codinglanguage: "",
    databasename: "",
    duration: "",
    registerdate: "",
    description: "",
    plname: [],
    stage: "",
  });

  const handleDeveloperSelection = (event, developer) => {
    const developersSet = new Set(selectedDevelopers.map((dev) => dev.id));

    if (event.target.checked) {
      developersSet.add(developer.id);
    } else {
      developersSet.delete(developer.id);
    }

    setSelectedDevelopers(users.filter((user) => developersSet.has(user.id)));
  };

  const updateProject = async (e) => {
    e.preventDefault();

    if (selectedDevelopers.length === 0) {
      setErrorAlert("Please select at least one developer.");
      return;
    }

    try {
      const payload = {
        ...bookForm,
        plname: selectedDevelopers.map((dev) => dev.name), // Send as an array of strings
      };

      setProcessing(true);
      const response = await axios.post(
        "http://localhost:4000/api/allocate/createlead",
        payload
      );
      setAlert("Project developers allocated successfully.");
      setEditModal(false); // Close the modal
      getTL(); // Refresh the table data
    } catch (err) {
      console.log(err.message);
      setErrorAlert("Error while allocating project developers.");
    } finally {
      setProcessing(false);
    }
  };

  const getTL = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/get-lead"
      );
      setTL(
        response.data.data.map((item) => ({
          projectName: item.projectname,
          teamLead: item.plname,
        }))
      );
    } catch (err) {
      console.log(err.message);
      setErrorAlert("Error while fetching team lead data.");
    }
  };

  useEffect(() => {
    getTL();
  }, []);

  // Function to handle stage change
  const handleStageChange = async (projectname, stage) => {
    try {
      const response = await axios.put('http://localhost:4000/api/allocate/update-stage', {
        stage, projectname
      });

      // Update the stage in the local state
      setProjectStages((prevStages) => ({
        ...prevStages,
        [projectname]: stage,
      }));

      setAlert("Project stage updated successfully.");
    } catch (err) {
      console.error(err);
      setErrorAlert("Error while updating project stage.");
    }
  };

  // Function to get color based on stage
  const getStageColor = (stage) => {
    switch (stage) {
      case "Start":
        return "#FFCCCB"; // Light Red
      case "Process":
        return "#ADD8E6"; // Light Blue
      case "Finish":
        return "#90EE90"; // Light Green
      default:
        return "#FFFFFF"; // White
    }
  };

  const editDialog = (
    <Dialog
      open={editModal}
      onClose={() => {
        setEditModal(false);
        setSelectedDevelopers([]); // Clear selected developers on modal close
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={updateProject} method="post">
        <Container>
          <DialogTitle className="mt-2">Edit Project</DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
            {alert && <Alert severity="success">{alert}</Alert>}

            <FormControl>
              <TextField name="id" value={bookForm.id} type="hidden" />
            </FormControl>

            {/* Project Details - Make them read-only for Admin */}
            <FormControl margin="normal" fullWidth>
              <TextField
                required
                name="projectname"
                onChange={handleChange}
                value={bookForm.projectname}
                label="Project Name"
                type="text"
                fullWidth
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled
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
                rows={4}
                fullWidth
                disabled
              />
            </FormControl>

            {/* Select Team Leader (Project Developer) */}
            <FormControl margin="normal" fullWidth>
              {users.map((user) => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={selectedDevelopers.some((dev) => dev.id === user.id)}
                      onChange={(event) => handleDeveloperSelection(event, user)}
                      name={user.name}
                    />
                  }
                  label={user.name}
                />
              ))}
            </FormControl>
          </Container>
        </DialogContent>
        <DialogActions>
          <Container>
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: "20px" }}
              endIcon={<SaveIcon />}
              disabled={processing}
              size="large"
              fullWidth
              type="submit"
            >
              {processing ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Container>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <div>
      <Container>
        {alert && <Alert severity="success">{alert}</Alert>}
        {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Coding Language</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Register Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Project Developer</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell align="center">Allocate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingProjects ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((book) => {
                      const projectAllocation = TL.find((item) => item.projectName === book.projectname);
                      return (
                        <TableRow key={book.id}>
                          <TableCell>{book.projectname}</TableCell>
                          <TableCell>{book.codinglanguage}</TableCell>
                          <TableCell>{book.databasename}</TableCell>
                          <TableCell>{book.duration}</TableCell>
                          <TableCell>{book.registerdate}</TableCell>
                          <TableCell>{book.description}</TableCell>
                          <TableCell>
                            {projectAllocation && projectAllocation.teamLead
                              ? projectAllocation.teamLead.join(", ")
                              : "Not Assigned"}
                          </TableCell>
                          <TableCell style={{ backgroundColor: getStageColor(projectStages[book._id]) }}>
                            <Select
                              value={projectStages[book._id] || "Start"}
                              onChange={(e) => handleStageChange(book.projectname, e.target.value)}
                            >
                              <MenuItem value="Start">Start</MenuItem>
                              <MenuItem value="Process">Process</MenuItem>
                              <MenuItem value="Testing">Testing</MenuItem>
                              <MenuItem value="Deployment">Deployment</MenuItem>
                              <MenuItem value="Finish">Finish</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell align="center">
                            <EditIcon
                              style={{ cursor: "pointer", color: "#27ae60" }}
                              onClick={() => {
                                setBookForm(book);
                                setEditModal(true); // Open the modal to allocate a project leader
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {editDialog}
      </Container>
    </div>
  );
}

export default LeadAllocation;