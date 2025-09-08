const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

const plantRoutes = require('./routes/plantRoutes');
const participantRoutes = require("./routes/participantRoutes");

const PORT = process.env.PORT || 3000;
connectDb();

app.use(express.json());
app.use(cors({
  origin: ["https://c-raftgardening.vercel.app"], 
  credentials: true
}));
app.use(express.static("public"));

// Route mounts
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));
app.use("/api", plantRoutes);
app.use('/api/participants', participantRoutes); 

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`App is listening on port ${PORT}`);
  }
});

