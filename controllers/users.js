const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const AllocateProject = require("../models/plallocate");
const userExtractor = require("../utils/middleware").userExtractor;

// GET all users
usersRouter.get("/", userExtractor, async (req, res) => {
  const users = await User.find({})
    .populate("borrowedBooks", {
      status: 1,
      dateBorrowed: 1,
      dateApproved: 1,
      returnDate: 1,
      bookTitle: 1,
    })
    .populate("reservedBooks", {
      status: 1,
      reservationDate: 1,
      dateCreated: 1,
      dateApproved: 1,
      bookTitle: 1,
    });
  return res.json(users);
});

// GET specific user
usersRouter.get("/:id", userExtractor, async (req, res) => {
  const user = await User.findById(req.params.id).populate("borrowedBooks", {
    borrowedBook: 1,
    author: 1,
  });
  return res.json(user);
});

// CREATE new user
usersRouter.post("/", async (req, res) => {
  const body = req.body;
  const password = body.password;
  console.log(req.body)

  if (!password || password.length < 3) {
    return res
      .status(400)
      .send({ error: "password must be at least 3 characters long" })
      .end();
  }

  const saltRounds = 10;
  // const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password: body.password,
    userType: body.userType,
    dateCreated: new Date().toISOString(),
  });

  const savedUser = await user.save();
  return savedUser ? res.status(201).json(savedUser) : res.status(400).end();
});

// DELETE a user
usersRouter.delete('/:id', userExtractor, async (req, res) => {
  const userId = req.params.id;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  console.log(user, "This is USER")

  // Check if the user has been allocated a project and update the allocation
  const allocatedProjects = await AllocateProject.find({ plname: user.username });
  if (allocatedProjects.length > 0) {
    await AllocateProject.updateMany(
      { plname: user.username },
      { $set: { plname: "Not Allocated" } }
    );
  }

  // Delete the user
  const deletedUser = await User.findByIdAndRemove(userId);
  return deletedUser ? res.json(deletedUser) : res.status(404).end();
});

// UPDATE user data
usersRouter.put('/:id', userExtractor, async (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  const userData = await User.findById(userId);
  if (!userData) {
    return res.status(404).send({ error: 'Invalid User' });
  }

  const updatedUser = {
    username: body.username || userData.username,
    name: body.name || userData.name,
    password: body.password || userData.password,
    userType: body.userType || userData.userType,
  };

  const newUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
  return newUser ? res.json(newUser) : res.status(404).end();
});

module.exports = usersRouter;
