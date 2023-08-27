const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const path = require('path');

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const quotes = require("./routes/quotes");

const app = express();

// Body Parser

app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 5000;

// Mount routers
app.use("/v1/quotes", quotes);

app.use(errorHandler);

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgGreen
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
