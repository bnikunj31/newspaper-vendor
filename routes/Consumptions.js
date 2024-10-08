const express = require("express");
const {
  showConsumptions,
  addConsumptionForm,
  addConsumption,
  deleteConsumption,
  updateConsumptionForm,
  updateConsumption,
  disable,
  enable,
} = require("../controller/Consumptions");
const router = express.Router();

router.get("/", showConsumptions);
router.get("/add", addConsumptionForm);
router.post("/add", addConsumption);
router.get("/update/:id", updateConsumptionForm);
router.post("/update", updateConsumption);
router.get("/delete/:id", deleteConsumption);
router.get("/disable/:id", disable);
router.get("/enable/:id", enable);

module.exports = router;
