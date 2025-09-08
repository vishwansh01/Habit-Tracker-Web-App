import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const s = authHeader && authHeader.split(" ")[1];
  const token = s && s.split(`"`)[0];
  // console.log(token);
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Wrong input token" });
    // console.log(user);
    req.user = user;
    next();
  });
  // console.log(req.user);
}

export default authMiddleware;
