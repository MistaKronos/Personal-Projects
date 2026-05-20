const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.cookies.token; // Check for header for backend or cookies for frontend
  if (authHeader) {
    const token = authHeader.split(" ")[1] || authHeader;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(403).json({ message: "Forbidden, invalid token" });
      }
      console.log("Authenticated User:", user);
      req.user = user;
      next();
    });
  } else {
    console.log(
      "No token provided, authorization header:",
      req.headers.authorization
    );
    res.status(401).json({ message: "Unauthorized, no token provided" });
  }
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    next(); // User is admin, proceed to the next middleware
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
}

module.exports = { authenticateJWT, isAdmin };
