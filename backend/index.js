const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const connectDB = require("./db");
const canvasRoutes = require("./routes/canvasRoutes");
require('dotenv').config();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/canvas", canvasRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


