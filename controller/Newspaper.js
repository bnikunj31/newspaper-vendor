const db = require("../config/db");

// Show Newspapers=
exports.showNewspaper = async (req, res) => {
  try {
    db.all(
      "SELECT n.*, d.combinationDays FROM newspaper n LEFT JOIN days d ON n.combinationId = d.combinationId",
      (err, rows) => {
        if (err) {
          console.error("Error in selecting newspapers: ", err);
        } else {
          res.render("Newspaper/showNewspaper", { rows: rows });
        }
      }
    );
  } catch (err) {
    console.error("Error in fetching newspapers: ", err);
  }
};

// Add Newspaper
exports.addNewspaperForm = async (req, res) => {
  try {
    db.all("select * from days", [], (err, rows) => {
      if (err) {
        console.error("Error fetching Newspapers: ", err);
      } else {
        db.all("Select * from newspaper", (err, data) => {
          if (err) {
            console.error("Error in fetching newspapers for form: ", err);
          } else {
            // res.json({ rows, data });
            res.render("Newspaper/addNewspaper", {
              rows: rows,
              data: data,
            });
          }
        });
      }
    });
  } catch (e) {
    console.error("Error Showing Newspapers add form: ", e);
  }
};

exports.addNewspaper = async (req, res) => {
  try {
    const { code, name, price, available, days } = req.body;
    db.get(
      "Select * from days where combinationDays = ?",
      [days],
      (err, row) => {
        if (err) {
          console.error("Error etching days in newspaper: ", err);
        } else {
          if (row) {
            db.run(
              "Insert into newspaper (newspaperCode, newspaperName, price, Available, combinationId) VALUES (?,?,?,?,?)",
              [code, name, price, available, row.combinationId],
              (err) => {
                if (err) {
                  console.error("Error inserting Newspaper:", err);
                } else {
                  res.redirect("/newspaper");
                }
              }
            );
          }
        }
      }
    );
    console.log(req.body);
  } catch (err) {
    console.error("Error adding newspaper: ", err);
  }
};

// Update Newspaper
exports.updateNewspaperForm = async (req, res) => {
  try {
    const id = req.params.id;
    db.get(
      "SELECT n.*, d.combinationDays FROM newspaper n LEFT JOIN days d ON n.combinationId = d.combinationId where n.newspaperId=?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("Error in fetching in newspaper update: ", err);
        } else {
          db.all("Select * from days", (errs, data) => {
            if (errs) {
              console.error("Error in fetching in days: ", errs);
            } else {
              res.render("Newspaper/updateNewspaper", {
                rows: rows,
                data: data,
              });
            }
          });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing newspaper update form: ", err);
  }
};

exports.updateNewspaper = async (req, res) => {
  try {
    const { id, code, name, price, available, days } = req.body;
    db.get(
      "Select * from days where combinationDays = ?",
      [days[0]],
      (err, rows) => {
        if (err) {
          console.error("Error in fetching days for newspaper: ", err);
        } else {
          if (rows) {
            db.run(
              "UPDATE newspaper SET newspaperName = ?, price = ?, Available = ?, CombinationId=? where newspaperId = ?",
              [name, price, available, rows.combinationId, id],
              (err) => {
                if (err) {
                  console.error("Error in updating newspaper: ", err);
                } else {
                  res.redirect("/newspaper");
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    console.error("Error in Updating newspaper: ", err);
  }
};

// Delete Newspaper
exports.deleteNewspaper = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    db.run("Delete from newspaper where newspaperId = ?", [id], (err) => {
      if (err) {
        console.error("Error in deleting newspapers: ", err);
      } else {
        res.redirect("/newspaper");
      }
    });
  } catch (err) {
    console.error("Error in deleting newspaper: ", err);
  }
};

// Disable Colony
exports.disable = async (req, res) => {
  try {
    const code = req.params.id;
    db.run(
      `Update newspaper SET disable=? where newspaperId = ?`,
      [1, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/newspaper");
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
      `Update newspaper SET disable=? where newspaperId = ?`,
      [0, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/newspaper");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};
