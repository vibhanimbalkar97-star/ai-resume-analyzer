const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const redisClient = require("../config/redis.js");

const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Token not provided");
  }

  const isBlacklisted = await redisClient.get(token);

  if (isBlacklisted) {
    //     cookie cleared
    res.cookie(token, "");

    res.status(401);
    throw new Error("Unauthorized User");
  }

  // If token NOT blacklisted:
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; //attach user
  next();
});

module.exports = authUser;
