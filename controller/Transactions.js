const db = require("../config/db");

exports.showTransactions = async (req, res) => {
  try {
    db.all(
      `
          SELECT 
            transactions.*, 
            customer.*, 
            newspaper.*, 
            days.*
          FROM 
            transactions
          INNER JOIN 
            customer ON transactions.customerId = customer.customerId
          INNER JOIN 
            newspaper ON transactions.newspaperId = newspaper.newspaperId
          INNER JOIN 
            days ON transactions.combinationId = days.combinationId
        `,
      (err, data) => {
        if (err) {
          console.error("Error in fetching transactions: ", err);
        } else {
          res.render("Transactions/showTransactions", { data: data });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing transactions: ", err);
  }
};

exports.showDailyTransactions = async (req, res) => {
  let transactions = [];
  try {
    db.all(
      `SELECT 
            transactions.*, 
            customer.*, 
            newspaper.*, 
            days.*
          FROM 
            transactions
          INNER JOIN 
            customer ON transactions.customerId = customer.customerId
          INNER JOIN 
            newspaper ON transactions.newspaperId = newspaper.newspaperId
          INNER JOIN 
            days ON transactions.combinationId = days.combinationId`,
      (err, data) => {
        if (err) {
          console.error("Error in showing daily transactions: ", err);
        } else {
          for (let i = 0; i < data.length; i++) {
            let date = data[i].transactionDate;
            if (date === getCurrentDate()) {
              transactions.push(data[i]);
            }
          }
          res.render("Transactions/dailyTransactions", { data: transactions });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing daily transactions: ", err);
  }
};

// Add Transaction
exports.generateTransactions = async (req, res) => {
  try {
    db.all("Select * from colony", (err, data) => {
      if (err) {
        console.error("Error in getting colony for add: ", err);
      } else {
        res.render("Transactions/addTransactions", { data: data });
      }
    });
  } catch (err) {
    console.error("Error in showing transactions add: ", err);
  }
};

exports.addTransactions = async (req, res) => {
  try {
    db.all(
      `
        SELECT c.*, n.price 
        FROM consumption c
        JOIN newspaper n ON c.newspaperId = n.newspaperId`,
      (err, consumptions) => {
        if (err) {
          console.error("Error in adding transactions: ", err);
        } else {
          console.log("consumptions: ");
          for (let i = 0; i < consumptions.length; i++) {
            if (consumptions[i].isActive == 1) {
              console.log(consumptions[i]);
              db.serialize(() => {
                db.run(
                  `INSERT INTO transactions (customerId, newspaperId, combinationId, price, attendance) VALUES (?,?,?,?,?)`,
                  [
                    consumptions[i].customerId,
                    consumptions[i].newspaperId,
                    consumptions[i].combinations,
                    consumptions[i].price,
                    consumptions[i].isActive,
                  ]
                );
                db.run(
                  `UPDATE customer SET lastActive = ? WHERE customerId = ?`,
                  [getCurrentDate(), consumptions[i].customerId]
                );
              });
            }
          }
          db.all(
            `SELECT customerId, lastActive FROM customer`,
            (err, customers) => {
              if (err) {
                console.error("Error in customers addTransactions", err);
              } else {
                customers.forEach((customer) => {
                  if (customer.lastActive >= getDate45DaysAgo()) {
                    db.run(
                      `UPDATE customer SET defaulter = ? WHERE customerId = ? `,
                      [customer.lastActive, customer.customerId],
                      (err) => {
                        if (err) {
                          console.error(
                            `Error in updating defaulter of ${customer.customerId}`,
                            err
                          );
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error in adding transactions: ", err);
  }
};

// Make Single Transaction
exports.singleTransactionAdd = async (req, res) => {
  try {
    db.all(
      `SELECT customerId as id, customerName as name, 'Customer' as type FROM customer 
        UNION ALL
        SELECT newspaperId, newspaperName as name, 'Newspaper' as type FROM newspaper
        UNION ALL
        SELECT combinationId as id, combinationDays as name, 'Days' as type FROM days
        UNION ALL
        SELECT colonyCode as id, colonyName as name, 'Colony' as type FROM colony`,
      (err, data) => {
        if (err) {
          console.error("Error in displaying consumption add form ", err);
        } else {
          res.render("Transactions/singleTransaction", { data: data });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing consumer add form ", err);
  }
};

exports.singleTransaction = async (req, res) => {
  try {
    const { customerId, newspaperCode, days, date } = req.body;
    db.get(
      `Select price from newspaper where newspaperId = ? `,
      [newspaperCode],
      (err, data) => {
        if (err) {
          console.error("Error in price of single transaction: ", err);
        } else {
          db.run(
            `INSERT INTO transactions (customerId, newspaperId, Attendance, combinationId, price, transactionDate) VALUES (?,?,?,?,?,?)`,
            [customerId, newspaperCode, 1, days, data.price, date],
            (err) => {
              if (err) {
                console.error("Error in making single transactions: ", err);
              } else {
                res.redirect("/transactions");
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error in updating transactions: ", err);
  }
};

// Delete Transactions
exports.deleteTransactions = async (req, res) => {
  try {
    // db.all("Select 8 from transactions");
  } catch (err) {
    console.error("Error in delete transactions: ", err);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    db.all(
      `Select * from transactions where transaction_id = ?`,
      [id],
      (err, data) => {
        if (err) {
          console.error("Error fetching transaction: ", err);
        } else {
          console.log("Data: ", data);
          db.serialize(
            () => {
              db.run(
                "Update consumption SET isActive = 0 where customerId = ? and newspaperId = ?",
                [data.customerId, data.newspaperId]
              );
              db.run(`Delete from transactions where transaction_id = ?`, [id]);
            },
            (err) => {
              console.error("Error removing and updating transaction: ", err);
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error removing transaction: ", err);
  }
};

// Generate Transactions
exports.generate = async (req, res) => {
  try {
    const { colony } = req.body;
    db.run(
      `
        UPDATE consumption 
        SET isActive = 1 
        WHERE colonyCode = ?
      `,
      [colony],
      (err) => {
        if (err) {
          console.error("Error update transactions (consumptions): ", err);
        } else {
          res.redirect("/transactions");
        }
      }
    );
  } catch (err) {
    console.error("Error in generating transactions: ", err);
  }
};

// Update Transactions
exports.updateTransactionsForm = async (req, res) => {
  const id = req.params.id;
  try {
    db.all(
      `SELECT customerId as id, customerName as name, 'Customer' as type FROM customer 
        UNION ALL
        SELECT newspaperId as id, newspaperName as name, 'Newspaper' as type FROM newspaper
        UNION ALL
        SELECT combinationId as id, combinationDays as name, 'Days' as type FROM days
        UNION ALL
        SELECT colonyCode as id, colonyName as name, 'Colony' as type FROM colony`,
      (err, data) => {
        if (err) {
          console.error("Error in fetching data's: ", err);
        } else {
          db.get(
            `SELECT * from transactions where transaction_id = ?`,
            [id],
            (err, data1) => {
              if (err) {
                console.error(`Error in fetching transaction with id = ${id}`);
              } else {
                console.log(data1);

                res.render("Transactions/updateTransactions", {
                  data: data,
                  data1: data1,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error  updating transaction: ", err);
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id, combinationId, price, attendance } = req.body;
    console.log(req.body);
    db.run(
      `Update transactions set attendance = ?, combinationId = ?, price = ? where transaction_id =? `,
      [attendance, combinationId, price, id],
      (err) => {
        if (err) {
          console.error("Error in u[dating transaction: ", err);
        } else {
          res.redirect("/transactions");
        }
      }
    );
  } catch (err) {
    console.error("Error in updating transaction on submit: ", err);
  }
};

// Generate current date
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDate45DaysAgo = () => {
  const today = new Date();
  today.setDate(today.getDate() - 45);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
