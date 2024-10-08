const express = require("express");
const {
  showTransactions,
  showDailyTransactions,
  generateTransactions,
  addTransactions,
  singleTransaction,
  deleteTransactions,
  remove,
  generate,
  singleTransactionAdd,
  updateTransactionsForm,
  updateTransaction,
} = require("../controller/Transactions");
const router = express.Router();

router.get("/", showTransactions);
router.get("/dailytransactions", showDailyTransactions);
router.get("/add", generateTransactions);
router.post("/add", addTransactions);
router.get("/singletransaction", singleTransactionAdd);
router.post("/singletransaction", singleTransaction);
router.get("/delete", deleteTransactions);
router.get("/remove/:id", remove);
router.post("/generate", generate);
router.get("/update/:id", updateTransactionsForm);
router.post("/update", updateTransaction);

module.exports = router;
