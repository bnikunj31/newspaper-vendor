const express = require("express");
const {
  showDays,
  addDaysForm,
  addDays,
  updateDaysForm,
  updateDays,
  deleteCombination,
  enable,
  disable,
} = require("../controller/Days");
const router = express.Router();

router.get("/", showDays);
router.get("/add", addDaysForm);
router.post("/add", addDays);
router.get("/update/:id", updateDaysForm);
router.post("/update", updateDays);
router.get("/delete/:id", deleteCombination);
router.get("/disable/:id", disable);
router.get("/enable/:id", enable);

module.exports = router;
