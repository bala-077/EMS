import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TextField,
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
  MenuItem,
  Select,
  Chip,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete"; // Updated import for Autocomplete
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { useForm } from "./../../Custom-Hook/userForm";
import { fetchTeamLeader } from "./../../Api/Users/Users";
import { fetchBooks } from "./../../Api/Books/Books";
import { plAllocate } from "./../../Api/Allocations/Allocations";
import { checkToken } from "../../Api/Users/Users";
import { useHistory } from "react-router";
import Alert from "@material-ui/lab/Alert";
import { debounce } from "lodash";
import axios from "axios";

// Define stages and their corresponding colors
const stages = [
  { value: "Not Started", color: "red" },
  { value: "In Progress", color: "yellow" },
  { value: "Completed", color: "green" },
];

function ProjectAllocate() {
  const [editModal, setEditModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [processing, setProcessing] = useState(false);
  const [userType, setUserType] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const history = useHistory();
  const [TL, setTL] = useState([
    {
      projectName: "",
      teamLead: "",
    },
  ]);

  useEffect(() => {
    let isCancelled = false;

    const fetchApi = async () => {
      setLoadingProjects(true);
      setLoadingUsers(true);

      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) history.push("/");

        const usersData = await fetchTeamLeader();
        const booksData = await fetchBooks();

        if (!isCancelled) {
          setUserType(res.data.userType);
          setUsers(usersData);
          setProjects(booksData);
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
    projectId: projects._id,
    projectname: "",
    codinglanguage: "",
    databasename: "",
    duration: "",
    registerdate: "",
    description: "",
    plname: "",
    stage: "Not Started", // Default stage
  });

  const updateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/allocate/create",
        bookForm
      );
      console.log(response);
      setAlert("Project leader allocated successfully.");
      setEditModal(false); // Close the modal after successful update
      getTL(); // Refresh the project list
    } catch (err) {
      console.log(err.message);
      setErrorAlert("Error while allocating project leader.");
    }
  };

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
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getTL();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editDialog = (
    <Dialog open={editModal} onClose={() => setEditModal(false)} scroll="body" fullWidth>
      <form onSubmit={updateProject} method="post">
        <Container>
          <DialogTitle className="mt-2">Edit Project</DialogTitle>
        </Container>
        <DialogContent>
          <Container>
            {errorAlert}

            <FormControl>
              <TextField name="id" value={bookForm.id} type="hidden" />
            </FormControl>

            {/* Project Details */}
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

            {/* Select Team Leader */}
            <FormControl margin="normal" fullWidth>
              <Autocomplete
                id="user-select-combobox"
                options={users}
                getOptionLabel={(option) => option.name}
                style={{ width: "100%" }}
                value={users.find((user) => user.name === bookForm.plname) || null}
                renderInput={(params) => (
                  <TextField {...params} label="Project Developer" variant="outlined" />
                )}
                onChange={(event, newValue) => {
                  setBookForm((prev) => ({
                    ...prev,
                    plname: newValue ? newValue.name : "",
                  }));
                }}
              />
            </FormControl>

            {/* Select Stage */}
            <FormControl margin="normal" fullWidth>
              <Select
                value={bookForm.stage}
                onChange={(e) =>
                  setBookForm((prev) => ({ ...prev, stage: e.target.value }))
                }
                displayEmpty
                fullWidth
              >
                {stages.map((stage) => (
                  <MenuItem key={stage.value} value={stage.value}>
                    {stage.value}
                  </MenuItem>
                ))}
              </Select>
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
              Save
            </Button>
          </Container>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <div>
      <Container>
        {alert}
        <input
          type="search"
          onChange={handleSearch}
          className="w-full p-2 border-none border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search Projects"
        />
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
                {/* Render filtered rows */}
                <TableBody>
                  {loadingProjects ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Loading projects...
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.projectname}</TableCell>
                        <TableCell>{book.codinglanguage}</TableCell>
                        <TableCell>{book.databasename}</TableCell>
                        <TableCell>{book.duration}</TableCell>
                        <TableCell>{book.registerdate}</TableCell>
                        <TableCell>{book.description}</TableCell>
                        <TableCell>
                          {TL.find((t) => t.projectName === book.projectname)?.teamLead ||
                            "Not Allocated"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={book.stage}
                            style={{
                              backgroundColor:
                                stages.find((s) => s.value === book.stage)?.color || "gray",
                              color: "white",
                            }}
                          />
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
                    ))
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

export default ProjectAllocate;