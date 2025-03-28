import React, { useState, useEffect, useContext } from "react";
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
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { useForm } from "./../../Custom-Hook/userForm";
import { fetchProjectDeveloper, checkToken } from "./../../Api/Users/Users";
import { fetchBooks } from "./../../Api/Books/Books";
import { useHistory } from "react-router";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { userData } from "../context/userContext";

function LeadAllocation() {
  const [editModal, setEditModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [processing, setProcessing] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [TL, setTL] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const { data } = useContext(userData);
  const [projectStages, setProjectStages] = useState({});
  const [Tls, setTls] = useState([]);
  const [storeData, setStoredata] = useState("");
  const [status, setStatus] = useState([]);
  const [fieldMismatches, setFieldMismatches] = useState([]);

  const getDatas = () => {
    const result = sessionStorage.getItem("user");
    
    if (result) {
      try {
        const { username } = JSON.parse(result);
        setStoredata(username);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found in sessionStorage");
    }
  }

  const getTL = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/get-allocation"
      );
      setTL(
        response.data.data.map((item) => ({
          projectName: item.projectname,
          teamLead: item.plname,
        }))
      );
      setTls(response.data.data);
      setStatus(response.data.data); // Set status data here
    } catch (err) {
      console.log(err.message);
    }
  };

  // Function to compare book fields with status data
  const checkBookFieldsOnStatusUpdate = () => {
    if (status.length > 0 && projects.length > 0) {
      const mismatches = [];
      
      status.forEach((statusItem) => {
        const matchingProject = projects.find(
          (project) => project.projectname === statusItem.projectname
        );
        
        if (matchingProject) {
          const fieldsToCompare = [
            'codinglanguage',
            'databasename',
            'duration',
            'description'
          ];
          
          const mismatchedFields = fieldsToCompare.filter(
            (field) => matchingProject[field] !== statusItem[field]
          );
          
          if (mismatchedFields.length > 0) {
            mismatches.push({
              projectName: statusItem.projectname,
              fields: mismatchedFields
            });
          }
        }
      });
      
      setFieldMismatches(mismatches);
      
      if (mismatches.length > 0) {
        console.warn("Field mismatches detected:", mismatches);
        setErrorAlert(`Field mismatches detected in ${mismatches.length} project(s)`);
      }
    }
  };

  useEffect(() => {
    getTL();
    getDatas();
    const fetchData = async () => {
      try {
        const tokenRes = await checkToken();
        if (tokenRes === undefined || tokenRes.status === 401) history.push("/");

        const [usersData, booksData] = await Promise.all([
          fetchProjectDeveloper(),
          fetchBooks(),
        ]);

        setUsers(usersData);
        setProjects(booksData);

        // Initialize project stages
        const stages = {};
        booksData.forEach((book) => {
          stages[book._id] = book.stage || "Start";
        });
        setProjectStages(stages);

        // Fetch team leads
        const leadRes = await axios.get("http://localhost:4000/api/allocate/get-lead");
        setTL(
          leadRes.data.data.map((item) => ({
            projectName: item.projectname,
            teamLead: item.plname,
          }))
        );
        setStatus(leadRes.data.data); // Set status data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [history]);

  // Run comparison when status or projects change
  useEffect(() => {
    checkBookFieldsOnStatusUpdate();
  }, [status, projects]);

  const filterData = Tls.filter((item) => item.plname === storeData);

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
    event.target.checked ? developersSet.add(developer.id) : developersSet.delete(developer.id);
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
        plname: selectedDevelopers.map((dev) => dev.name),
      };

      setProcessing(true);
      await axios.post("http://localhost:4000/api/allocate/createlead", payload);
      setAlert("Project developers allocated successfully.");
      setEditModal(false);
      const leadRes = await axios.get("http://localhost:4000/api/allocate/get-lead");
      setTL(
        leadRes.data.data.map((item) => ({
          projectName: item.projectname,
          teamLead: item.plname,
        }))
      );
      setStatus(leadRes.data.data); // Update status after allocation
    } catch (err) {
      setErrorAlert("Error while allocating project developers.");
    } finally {
      setProcessing(false);
    }
  };

  const handleStageChange = async (projectId, stage) => {
    try {
      const project = projects.find((p) => p._id === projectId);
      await axios.put("http://localhost:4000/api/allocate/update-stage", {
        stage,
        projectname: project.projectname,
      });

      setProjectStages((prevStages) => ({
        ...prevStages,
        [projectId]: stage,
      }));

      // Update status data after stage change
      const updatedStatus = status.map(item => 
        item.projectname === project.projectname 
          ? { ...item, stage } 
          : item
      );
      setStatus(updatedStatus);

      setAlert("Project stage updated successfully.");
    } catch (err) {
      setErrorAlert("Error while updating project stage.");
      console.log(err.messagew)
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "Start":
        return "#FFCCCB";
      case "Process":
        return "#ADD8E6";
      case "Testing":
        return "#FFD700";
      case "Deployment":
        return "#87CEEB";
      case "Finish":
        return "#90EE90";
      default:
        return "#FFFFFF";
    }
  };

  const editDialog = (
    <Dialog open={editModal} onClose={() => setEditModal(false)} fullWidth>
      <form onSubmit={updateProject}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Container>
            {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
            {alert && <Alert severity="success">{alert}</Alert>}

            <TextField name="id" value={bookForm.id} type="hidden" />

            <TextField
              label="Project Name"
              name="projectname"
              value={bookForm.projectname}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Coding Language"
              name="codinglanguage"
              value={bookForm.codinglanguage}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Database Name"
              name="databasename"
              value={bookForm.databasename}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Duration"
              name="duration"
              value={bookForm.duration}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Register Date"
              name="registerdate"
              value={bookForm.registerdate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Description"
              name="description"
              value={bookForm.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              disabled
            />

            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Select Developers
            </Typography>
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
          </Container>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SaveIcon />}
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <Container>
      {alert && <Alert severity="success">{alert}</Alert>}
      {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
      
      {fieldMismatches.length > 0 && (
        <Alert severity="warning">
          Field mismatches detected in {fieldMismatches.length} project(s). 
          Please check console for details.
        </Alert>
      )}

      <Typography variant="h4" style={{ margin: "20px 0" }}>
        Project Allocation
      </Typography>

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filterData.map((book) => {
                const projectAllocation = TL.find((item) => item.projectName === book.projectname);
                return (
                  <TableRow key={book._id}>
                    <TableCell>{book.projectname}</TableCell>
                    <TableCell>{book.codinglanguage}</TableCell>
                    <TableCell>{book.databasename}</TableCell>
                    <TableCell>{book.duration}</TableCell>
                    <TableCell>{book.registerdate}</TableCell>
                    <TableCell>{book.description}</TableCell>
                    <TableCell>
                      {projectAllocation?.teamLead?.join(", ") || "Not Assigned"}
                    </TableCell>
                    <TableCell style={{ backgroundColor: getStageColor(projectStages[book._id]) }}>
                      <Select
                        value={status.projectname === book.projectname ? status.projectname : ""}
                        onChange={(e) => handleStageChange(book._id, e.target.value)}
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
                          setEditModal(true);
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

      {editDialog}
    </Container>
  );
}

export default LeadAllocation;