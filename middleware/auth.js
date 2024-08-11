const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(400).json('Access denied !!!');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.json("Invalid Token");
  }
};
