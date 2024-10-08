const express = require("express");

const users = require("../controller/User");
const router = express.Router();

// Users Related Routes
router.get("/", users.showUsers);
router.get("/add", users.addUserForm);
router.post("/add", users.addUser);
router.get("/update/:id", users.update);
router.post("/update", users.updateUser);
router.get("/delete/:id", users.delete);
router.get("/disable/:id", users.disable);
router.get("/enable/:id", users.enable);

module.exports = router;
