const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next("No token provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
  } catch (err) {
    return next(err);
  }
  if (!decodedToken) {
    return next("Invalid token");
  }
  req.isAuth = true;
  req.userId = decodedToken.id;
  next();
};

module.exports = verifyJWT;
