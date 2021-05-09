const errHandler = function (err, req, res, next) {
  // logic
  let errors;
  if (err.errors) {
    errors = err.errors.map((element) => element.message);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    res.status(400).json({ errors });
  } else if (err.name === "SequelizeValidationError") {
    res.status(400).json({ errors });
  } else if (err.name === "customError") {
    res.status(400).json({ message: err.msg });
  } else if (err.name === "custom401") {
    res.status(401).json({ message: err.msg });
  } else if (err.name === "custom404") {
    res.status(404).json({ message: err.msg });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = errHandler;
