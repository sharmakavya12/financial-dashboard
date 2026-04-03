const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recordRoutes = require("./routes/recordRoutes");

dotenv.config();

// Handle uncaught exceptions
process.on("unhandledRejection", (err) => {
  console.error("Unhandled error:", err.message);
  process.exit(1);
});

connectDB();

const app = express();

app.use(express.json());

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes); 

app.get("/" , (req,res) => {
    res.json({message : "Finance Dashboard API is running"});
});

// Global error handling middleware
app.use((err,req,res,next) => {
   console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((e) => e.message).join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered.",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT ,() => {
    console.log(`Server is running on port ${PORT}`);
});
