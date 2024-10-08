const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./newspaperVendor.db", (err) => {
  if (err) {
    console.error("Error opening database: ", err);
  } else {
    console.log("Database is running");
  }
});

// Function to get table structure
function getTableStructure(tableName) {
  db.serialize(() => {
    db.all(`PRAGMA table_info(${tableName});`, [], (err, rows) => {
      if (err) {
        throw err;
      }

      console.log(`Structure of the table '${tableName}':`);
      console.table(rows); // Display in a table format
    });
  });
}

// Call the function with your table name
getTableStructure("customer");
getTableStructure("colony");
getTableStructure("days");
getTableStructure("newspaper");
getTableStructure("consumption");
getTableStructure("transactions");

// Close the database connection
db.close((err) => {
  if (err) {
    console.error("Error closing database: ", err);
  }
});
