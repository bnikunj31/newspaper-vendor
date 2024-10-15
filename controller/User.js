const db = require("../config/db");

// Display Users
exports.showUsers = async (req, res) => {
  try {
    db.all(
      `SELECT customer.*, colony.* 
      FROM customer 
      JOIN colony ON customer.colony = colony.colonyName
      order by lastActive desc
      `,
      [],
      (err, rows) => {
        if (err) {
          console.error("Error Fetching Users: ", err);
        } else {
          // res.json({ rows: rows });
          res.render("Customer/showUsers", { rows: rows });
        }
      }
    );
  } catch (err) {
    console.log("Showing User Catch: ", err);
  }
};

// Add Users
exports.addUserForm = (req, res) => {
  try {
    db.all(`Select * from colony`, [], (err, rows) => {
      if (err) {
        console.error("Error Fetching user's colonies: ", err);
      } else {
        res.render("Customer/addUser", { rows: rows });
      }
    });
  } catch (err) {}
};

exports.addUser = async (req, res) => {
  try {
    const { name, address, contact_number, colony, paid, due, route } =
      req.body;
    await db.run(
      "INSERT INTO customer (customerName, address, contactNumber, colony, paid, due, route) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, contact_number, colony, paid, due, route],
      (err) => {
        if (err) {
          console.error("Error in Inserting User: ", err);
        } else {
          res.redirect("/");
        }
      }
    );
  } catch (err) {
    console.error("Adding User Catch: ", err);
  }
};

// Update Users
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.get(`SELECT * FROM customer WHERE customerId=${id}`, (err, data) => {
      if (err) {
        console.error("Error in Updating: ", err);
      } else {
        if (data) {
          db.all(`Select * from colony`, [], (err, colonies) => {
            if (err) {
              console.error("Error Fetching user's colonies: ", err);
            } else {
              // res.json({ data, colonies });
              res.render("Customer/updateUser", {
                data: data,
                colonies: colonies,
              });
            }
          });
        } else {
          console.log(`User Not Found with id: ${id}`);
          res.redirect("/");
        }
      }
    });
  } catch (err) {
    console.error("Update User Catch: ", err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      id,
      name,
      address,
      contact_number,
      colony,
      paid,
      due,
      route,
      defaulter,
    } = req.body;
    console.log(req.body);

    db.run(
      `UPDATE customer SET customerName = '${name}', address = '${address}', contactNumber = '${contact_number}', colony = '${colony}', paid = '${paid}', due = '${due}', route = '${route}', defaulter = '${defaulter[0]}' WHERE customerId = ${id}`,
      (err) => {
        if (err) {
          console.error("Error is Updating", err);
        } else {
          res.redirect("/");
        }
      }
    );
  } catch (err) {
    console.error("Updating User Catch", err);
  }
};

// Delete User
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.run(`DELETE FROM customer WHERE customerId = ${id}`, (err) => {
      if (err) {
        console.error("Error in deleting user", err);
      } else {
        res.redirect("/");
      }
    });
  } catch (err) {
    console.error("Deleting User Catch", err);
  }
};

// Disable Colony
exports.disable = async (req, res) => {
  try {
    const code = req.params.id;
    db.run(
      `Update customer SET disable=? where customerId = ?`,
      [1, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};

// Enable Colony
exports.enable = async (req, res) => {
  try {
    const code = req.params.id;
    db.run(
      `Update customer SET disable=? where customerId = ?`,
      [0, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};

// Calculate monthly Amount
exports.calculateMonthlySummary = (req, res) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const query = `
    SELECT DISTINCT customerId, SUM(price) AS totalPrice
    FROM transactions
    WHERE strftime('%m', transactionDate) = ?
      AND strftime('%Y', transactionDate) = ?
    GROUP BY customerId;
  `;

  db.all(query, [month < 10 ? `0${month}` : month, year], (err, rows) => {
    if (err) {
      console.error("Error fetching transaction data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Loop through the results and update the 'due' field for each customer
    rows.forEach((row) => {
      const updateQuery = `UPDATE Customer SET due = ? WHERE customerId = ?`;
      db.run(updateQuery, [row.totalPrice, row.customerId], (updateErr) => {
        if (updateErr) {
          console.error(
            `Error updating due for customerId ${row.customerId}:`,
            updateErr
          );
        } else {
          console.log(
            `Updated due for customerId ${row.customerId} to ${row.totalPrice}`
          );
        }
      });
    });

    res.json({
      message: "Monthly summary fetched and customer dues updated successfully",
      data: rows,
    });
  });
};
