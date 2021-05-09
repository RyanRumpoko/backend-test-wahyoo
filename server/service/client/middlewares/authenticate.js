const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

function createToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

const authenticate = function (req, res, next) {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    req.decoded = decoded;
    next();
  } catch (err) {
    next({ name: "custom401", msg: "Invalid token" });
  }
};

const authorize = function (req, res, next) {
  User.findOne({
    where: {
      id: +req.params.id,
    },
  })
    .then((data) => {
      if (!data) {
        throw { name: "custom404", msg: "Error not found" };
      } else if (data.id !== req.decoded.id) {
        throw { name: "customError", msg: "Not Authorized" };
      } else {
        next();
      }
    })
    .catch((err) => {
      if (err.name === "custom404") {
        next({ name: "custom404", msg: "Error not found" });
      } else if (err.name === "customError") {
        next({ name: "customError", msg: "Not Authorized" });
      } else {
        next(err);
      }
    });
};

module.exports = { createToken, authenticate, authorize };
