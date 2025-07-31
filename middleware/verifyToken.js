const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader); // 🐞 Debug line

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token); // 🐞 Debug line

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // make sure this matches
    console.log("Decoded JWT:", decoded); // 🐞 Debug line
    req.user = decoded; // make sure your token contains `id`
    next();
  } catch (err) {
    console.error("JWT verification error:", err); // 🐞 Debug
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
