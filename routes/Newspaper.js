const express = require("express");
const {
  showNewspaper,
  addNewspaperForm,
  addNewspaper,
  deleteNewspaper,
  updateNewspaperForm,
  updateNewspaper,
  disable,
  enable,
} = require("../controller/Newspaper");
const router = express.Router();

router.get("/", showNewspaper);
router.get("/add", addNewspaperForm);
router.post("/add", addNewspaper);
router.get("/update/:id", updateNewspaperForm);
router.post("/update", updateNewspaper);
router.get("/delete/:id", deleteNewspaper);
router.get("/disable/:id", disable);
router.get("/enable/:id", enable);

module.exports = router;
