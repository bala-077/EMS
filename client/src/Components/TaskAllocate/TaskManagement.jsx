import React, { useState, useEffect } from "react";

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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { formatDate } from "./../../Tools/Tools";
import { useForm } from "./../../Custom-Hook/userForm";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import {
  fetchTaskUsers,
  createUser,
  editUser,
  deleteUser,
} from "./../../Api/Users/Users";
import { checkToken } from "../../Api/Users/Users";
import { useHistory } from "react-router";

function TaskManagement() {
  const [users, setUsers] = useState([]);
  const [userForm, handleChange, setUserForm] = useForm({
    name: "",
    username: "",
    password: "",
    userType: "",
  });
  const [createModal, setCreateModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [userType, setUserType] = useState(null);

  const history = useHistory();

  useEffect(() => {
    let isCancelled = false;
    const fetchApi = async () => {
      const res = await checkToken();
      if (res === undefined) history.push("/");
      else if (res.status === 401) history.push("/");

      if (!isCancelled) {
        setUserType(res.data.userType);
      }
    };
    try {
      fetchApi();
    } catch (e) {
      console.log(e);
    }
    return () => (isCancelled = true);
  }, [history]);

  useEffect(() => {
    let isCancelled = false;
    const fetchApi = async () => {
      const res = await fetchTaskUsers();
      if (!isCancelled) {
        setUsers(res);
      }
    };
    fetchApi();
    return () => (isCancelled = true);
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const res = isEdit ? await editUser(userForm) : await createUser(userForm);

    if (res.status === 200 || res.status === 201) {
      setCreateModal(false);
      if (isEdit) {
        setUsers(
          users.map((user) => (user.id === res.data.id ? res.data : user))
        );
        setAlert(<Alert severity="success">Successfully edited User.</Alert>);
      } else {
        setUsers([res.data, ...users]);
        setAlert(
          <Alert severity="success">Successfully added new User.</Alert>
        );
      }
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

    setProcessing(false);
  };
  const destroyUser = async () => {
    setProcessing(true);
    const res = await deleteUser(userForm);
    if (res.status === 200 || res.status === 204) {
      setProcessing(false);
      setDeleteAlert(false);
      setUsers(users.filter((user) => user.id !== userForm.id));
      setUserForm({ username: "", name: "", password: "", userType: "" });
      setErrorAlert(
        <Alert style={{ textTransform: "capitalize" }} severity="error">
          You Have Successfully Deleted User.
        </Alert>
      );
      setTimeout(() => {
        setErrorAlert("");
      }, 10000);
    }
  };

  //Dialogs
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false);
        setUserForm({
          name: "",
          username: "",
          password: "",
          userType: "Project Leader",
        });
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={registerUser} method="post">
        <Container>
          <DialogTitle className="mt-2">
            {isEdit ? "Allocate" : "Add"}
            Task
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
                style={{ marginBottom: "20px" }}
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
                style={{ marginBottom: "20px" }}
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
  );
  const deleteDialog = (
    <div>
      <Dialog
        open={deleteAlert}
        onClose={() => {
          setUserForm({ username: "", name: "", password: "", userType: "" });
          setDeleteAlert(false);
        }}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CancelOutlinedIcon
            style={{
              color: "#e74c3c",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              display: "block",
              fontSize: "250px",
            }}
          />
          <DialogContentText
            style={{ textAlign: "center" }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete <strong>{userForm.username}</strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              destroyUser();
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
              setUserForm({
                username: "",
                name: "",
                password: "",
                userType: "",
              });
              setDeleteAlert(false);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  return (
    <div>
      <Container>
        <Grid container spacing={1}></Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            {alert}
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Task Status</TableCell>
                    <TableCell>Allocate Task</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>Complete</TableCell>

                      {userType === "PL" && (
                        <TableCell align="">
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
        {deleteDialog}
      </Container>
    </div>
  );
}
export default TaskManagement;
