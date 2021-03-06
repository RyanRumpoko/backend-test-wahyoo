if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const router = require("./routes/index");
const errHandler = require("./middlewares/errorHandler");
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.use(errHandler);

app.listen(port, () => console.log("Running on port: ", port));
