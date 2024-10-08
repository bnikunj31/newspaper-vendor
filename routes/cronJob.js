const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const cron = require("node-cron");
require("dotenv").config();

const configPath = path.join(__dirname, "config.json");

function loadCronTime() {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config.cronTime;
}

function updateCronJob(task, newCronTime) {
  task.stop();
  task = cron.schedule(newCronTime, () => {
    console.log("Cron job running with time:", newCronTime);
  });
  task.start();
  return task;
}

let cronTime = loadCronTime();
let task = cron.schedule(cronTime, () => {
  console.log("Cron job running with time:", cronTime);
});

router.get("/", (req, res) => {
  res.render("index", { cronTime });
});

router.post("/update-cron-time", (req, res) => {
  const { cronTime: newCronTime } = req.body;

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.cronTime = newCronTime;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  task = updateCronJob(task, newCronTime);
  

  res.json({ message: "Cron time updated successfully" });
});

module.exports = router;
