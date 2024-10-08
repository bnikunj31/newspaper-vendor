const express = require("express");
const db = require("../config/db");
const {
  showColonies,
  addColonyForm,
  addColony,
  deleteColony,
  update,
  updateColony,
  disable,
  enable,
} = require("../controller/Colony");
const router = express.Router();

router.get("/", showColonies);
router.get("/add", addColonyForm);
router.post("/add", addColony);
router.get("/update/:colonyCode", update);
router.post("/update", updateColony);
router.get("/delete/:colonyCode", deleteColony);
router.get("/disable/:colonyCode", disable);
router.get("/enable/:colonyCode", enable);

module.exports = router;
