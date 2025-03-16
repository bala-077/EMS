const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
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

//DELETE a book
usersRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user
  console.log(user)
  /*if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to remove a User` })
      .end()
  }
*/
  const delUser=await User.findByIdAndRemove(id)
  return delUser? res.json(delUser) : res.status(404).end()

})

//UPDATE book data
usersRouter.put('/:id', async (req, res) => {
  const body = req.body
  const id = req.params.id
  const user = req.user

  /*if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to update a User` })
      .end()
  }
  */
  const userData = await User.findById(id)
  if (!userData) {
    return res.status(404).send({ error: 'invalid User' })
  }

  const euser = {
    username: body.username ? body.username : userData.username,
    name: body.name ? body.name : userData.name,
    password: body.password ? body.password : userData.password,
    userType: body.userType ? body.userType : userData.userType,
    
  }

  const newUser= await User.findByIdAndUpdate(id, euser, { new: true })
  return newUser? res.json(newUser) : res.status(404).end()
})

module.exports = usersRouter;
