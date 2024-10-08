const cron = require("node-cron");
const transactions = require("./controller/Transactions");
cron.schedule("0 11 * * *", () => {
  console.log("Running scheduled task at 11 PM...");
  transactions.addTransactions();
});
