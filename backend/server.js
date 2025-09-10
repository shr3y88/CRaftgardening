const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");


const plantRoutes = require("./routes/plantRoutes");
const participantRoutes = require("./routes/participantRoutes");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");

const PORT = process.env.PORT || 3000;


connectDb();


app.use(express.json());


app.use(
  cors({
    origin: [
      "http://localhost:5173",          
      "http://localhost:3000",            
      "https://c-raftgardening.vercel.app" 
    ],
    credentials: true,
  })
);


app.use("/images", express.static("public/images"));


app.use("/api/users", userRoutes);       
app.use("/api/recipes", recipeRoutes);  
app.use("/api/plants", plantRoutes);     
app.use("/api/participants", participantRoutes);


app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});


app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(` Server running on port ${PORT}`);
  }
});

