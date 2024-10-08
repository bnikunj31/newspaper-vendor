const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./newspaperVendor.db", (err) => {
  if (err) {
    console.error("Error opening database: ", err);
  } else {
    db.serialize(
      () => {
        // Customers Table
        db.run(
          `CREATE TABLE IF NOT EXISTS customer (
          customerId INTEGER PRIMARY KEY AUTOINCREMENT, 
          customerName VARCHAR(50) NOT NULL, 
          address TEXT NOT NULL, 
          contactNumber VARCHAR(15) UNIQUE NOT NULL, 
          colony VARCHAR(10), 
          route INTEGER,
          paid DECIMAL(4, 2) DEFAULT 0.00, 
          due DECIMAL(4, 2) DEFAULT 0.00, 
          lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
          defaulter BOOLEAN DEFAULT FALSE,
          disable BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (colony) REFERENCES colony(colonyCode)
          )`
        );

        // Colony Table
        db.run(
          `CREATE TABLE IF NOT EXISTS colony (
            colonyCode VARCHAR(10) PRIMARY KEY, 
            colonyName VARCHAR(255) NOT NULL,
            disable BOOLEAN DEFAULT FALSE
        )`
        );

        // Days Table
        db.run(
          `CREATE TABLE IF NOT EXISTS days (
          combinationId INTEGER PRIMARY KEY AUTOINCREMENT, 
          combinationDays TEXT UNIQUE,
          disable BOOLEAN DEFAULT FALSE
          )`
        );

        // Newspaper Table
        db.run(
          `CREATE TABLE IF NOT EXISTS newspaper (
          newspaperId INTEGER PRIMARY KEY AUTOINCREMENT,
          newspaperCode VARCHAR(50), 
          newspaperName VARCHAR(255) NOT NULL, 
          CombinationId INTEGER ,
          price DECIMAL(5,2) NOT NULL,
          Available boolean default 1,
          disable BOOLEAN DEFAULT FALSE,
          UNIQUE (newspaperCode, CombinationId),
          FOREIGN KEY (CombinationId) REFERENCES days(combinationId)
        )`
        );

        // Consumption Table
        // db.run("DROP table if exists consumption");
        db.run(
          `CREATE TABLE IF NOT EXISTS consumption (
          consumptionId INTEGER PRIMARY KEY AUTOINCREMENT,
          colonyCode VARCHAR(10),
          customerId INTEGER,
          newspaperId INTEGER,
          combinations INTEGER,
          isActive BOOLEAN DEFAULT 1,
          disable BOOLEAN DEFAULT FALSE,  
          FOREIGN KEY (combinations) REFERENCES days(combinationId),
          FOREIGN KEY (colonyCode) REFERENCES colony(colonyCode),
          FOREIGN KEY (customerId) REFERENCES customer(customerId),
          FOREIGN KEY (newspaperId) REFERENCES newspaper(newspaperId)
        )`
        );

        // Transactions Table
        // db.run(`Drop table if exists transactions`)
        db.run(
          `CREATE TABLE IF NOT EXISTS transactions (
          transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, 
          customerId INTEGER, 
          newspaperId INTEGER,
          attendance BOOLEAN,
          combinationId INTEGER, 
          price DECIMAL(5,2), 
          transactionDate DATE DEFAULT (DATE('now')),
          FOREIGN KEY (customerId) REFERENCES customer(customerId),
          FOREIGN KEY (newspaperId) REFERENCES newspaper(newspaperId),
          FOREIGN KEY (combinationId) REFERENCES days(combinationId)
        )`
        );
      },
      (err) => {
        if (err) {
          console.error("Error in creating Tables", err);
        } else {
          console.log("Tables Created or Exist");
        }
      }
    );

    console.log("Database is running");
  }
});

module.exports = db;
