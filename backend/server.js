const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

const plantRoutes = require("./routes/plantRoutes");
const participantRoutes = require("./routes/participantRoutes");
const user = require("./routes/user");
const recipe = require("./routes/recipe");

const app = express();
const PORT = process.env.PORT || 3000;


connectDb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://c-raftgardening.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/images", express.static("public/images"));


app.use("/api/users", user);       
app.use("/api/recipe", recipe);     
app.use("/api", plantRoutes);       
app.use("/api/participants", participantRoutes);
app.use("/api/events", require("./routes/recipe"));


app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








