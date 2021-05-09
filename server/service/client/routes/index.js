const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authenticate");

router.post("/registration", UserController.register);
router.post("/login", UserController.login);
router.use(authenticate);
router.get("/:id", authorize, UserController.getById);
router.patch("/:id/withdraw", authorize, UserController.withdraw);
router.patch("/:id/deposit", authorize, UserController.deposit);

module.exports = router;
