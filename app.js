//  Packages
const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const transactionScheduler = require("./transactionScheduler");
const moneyScheduler = require("./monthlyTransaction");
const cron = require("./routes/cronJob");

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

app.use(
  session({
    secret: "shhhhh",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  console.log(req.flash('error'));
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/", users);
app.use("/colony", colony);
app.use("/days", days);
app.use("/cron", cron);
app.use("/newspaper", newspaper);
app.use("/consumptions", consumptions);
app.use("/transactions", transactions);

app.listen(port, () => console.log("Server is running"));

module.exports = app;
