const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const transactions = require("./controller/Transactions");

const configPath = path.join(__dirname, "routes", "config.json");

// Load the cron time from config.json
function loadCronTime() {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config.cronTime;
}

// Schedule the cron job with the time from config.json
const cronTime = loadCronTime();
cron.schedule(cronTime, () => {
  console.log(`Running scheduled task at ${cronTime}...`);
  transactions.addTransactions();
});
