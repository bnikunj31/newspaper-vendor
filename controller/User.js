const db = require("../config/db");

// Display Users
exports.showUsers = async (req, res) => {
  try {
    db.all("Select * from customer", [], (err, rows) => {
      if (err) {
        console.error("Error Fetching Users: ", err);
      } else {
        res.render("Customer/showUsers", { rows: rows });
      }
    });
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
    const { id, name, address, contact_number, colony, paid, due, route } =
      req.body;
    db.run(
      `UPDATE customer SET customerName = '${name}', address = '${address}', contactNumber = '${contact_number}', colony = '${colony}', paid = '${paid}', due = '${due}', route = '${route}' WHERE customerId = ${id}`,
      (err) => {
        if (err) {
          console.error("Error is Updating", err);
        } else {
          res.redirect("/");
          console.log("User Updated Successfully");
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
