const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
const movieRoutes = require("./Routes/movieRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api", movieRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running successfully ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
