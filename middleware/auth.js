const jwt = require("jsonwebtoken");
const SECRET = "SECr3t";

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decodedToken; // Set decoded token instead of just user
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJwt,
  SECRET,
  jwt,
};
