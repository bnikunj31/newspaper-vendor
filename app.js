//  Packages
const express = require("express");
const path = require("path");
const transactionScheduler = require("./transactionScheduler");

//  Files Imported
const db = require("./config/db");
const users = require("./routes/User");
const colony = require("./routes/Colony");
const days = require("./routes/Days");
const newspaper = require("./routes/Newspaper");
const consumptions = require("./routes/Consumptions");
const transactions = require("./routes/Transactions");

//  Server
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/", users);
app.use("/colony", colony);
app.use("/days", days);
app.use("/newspaper", newspaper);
app.use("/consumptions", consumptions);
app.use("/transactions", transactions);

app.listen(port, () => console.log("Server is running"));
