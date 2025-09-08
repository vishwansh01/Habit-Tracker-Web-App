import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET),
    (err, user) => {
      if (err) return res.status(403).json({ error: "Wrong input token" });
      req.user = user;
      next();
    };
}

export default authMiddleware;
