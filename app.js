const express = require("express");
const app = express();
const cors = require("cors");
require("express-async-errors");
const path = require("path");

const booksRouter = require("./controllers/books");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const borrowRouter = require("./controllers/borrows");
const reservationRouter = require("./controllers/reservations");
const dashboardRouter = require("./controllers/dashboard");
const projectsRouter = require("./controllers/projects"); // Assuming this is the route for projects
const middleware = require("./utils/middleware");
const connectDB = require("./config/db");
const projectAllocateRouter = require("./controllers/plallocate");
const route = require("./controllers/ProjectManager");
const lead = require("./controllers/leadController");
const router = require("./controllers/taskController");

connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Requests
app.use(express.static("build")); // Serve static files for production
app.use(express.json()); // Middleware to parse JSON bodies

// create the project manager allocation
app.use('/api/allocate/', route);

// create for the team lead
app.use('/api/allocate/', lead);

//for the task allocation
app.use('/api/allocate/', router)

// Request logging and token handling middleware
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
const userExtractor = middleware.userExtractor;

// Route Definitions
app.use("/api/books", userExtractor, booksRouter);
app.use("/api/users", usersRouter);  
// app.use("/api/allocate", projectAllocateRouter); // Project allocation routes
app.use("/api/allocate/", projectAllocateRouter); // Project allocation routes
app.use("/api/login", loginRouter);
app.use("/api/borrow", userExtractor, borrowRouter);
app.use("/api/reserve", userExtractor, reservationRouter);
app.use("/api/dashboard", userExtractor, dashboardRouter);
app.use("/api/projects", projectsRouter); // Assuming you need a route for handling projects

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Unknown endpoint handler (for 404s)
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
