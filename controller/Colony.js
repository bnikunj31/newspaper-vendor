const db = require("../config/db");

// Display Colonies
exports.showColonies = async (req, res) => {
  try {
    db.all("Select * from colony", [], (err, rows) => {
      if (err) {
        console.error("Error Fetching Users:", err);
      } else {
        res.render("Colony/showColony", { rows: rows });
      }
    });
  } catch (err) {
    console.log("Error Showing Colonies: ", err);
  }
};

// Add Colony
exports.addColonyForm = async (req, res) => {
  res.render("Colony/addColony", { error: "" });
};

exports.addColony = async (req, res) => {
  const { code, name } = req.body;
  const codeRegex = /^[A-Za-z0-9]+$/;
  const nameRegex = /^[A-Za-z]+$/;
  if (
    !codeRegex.test(code) ||
    code.length < 2 ||
    !nameRegex.test(name) ||
    name.length < 3
  ) {
    return res.render("Colony/addColony", {
      error:
        "Colony code must be alphanumeric and at least 2 characters long. Colony name must contain only letters and be at least 3 characters long.",
    });
  }
  try {
    db.run(
      "Insert into colony (colonyCode, colonyName) VALUES (?,?)",
      [code, name],
      (err) => {
        if (err) {
          console.error("Error in inserting colony: ", err);
        } else {
          res.redirect("/colony");
        }
      }
    );
  } catch (err) {
    console.error("Error in Add Controller ", err);
  }
};

// Update Colony
exports.update = async (req, res) => {
  try {
    const code = req.params.colonyCode;
    db.get("Select * from colony where colonyCode=?", [code], (err, rows) => {
      if (err) {
        console.error("Error in Updating: ", err);
      } else {
        res.render("Colony/updateColony", { rows: rows, error: "" });
      }
    });
  } catch (err) {}
};

exports.updateColony = async (req, res) => {
  try {
    const { code, name } = req.body;
    if (name.length < 3) {
      return res.redirect(`/colony/update/${code}`);
    }
    db.run(
      "UPDATE colony SET colonyName = ? where colonyCode = ?",
      [name, code],
      (err) => {
        if (err) {
          console.error("Error in Updating: ", err);
        } else {
          res.redirect("/colony");
        }
      }
    );
  } catch (err) {}
};

// Disable Colony
exports.disable = async (req, res) => {
  try {
    const code = req.params.colonyCode;
    db.run(
      `Update colony SET disable=? where colonyCode = ?`,
      [1, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/colony");
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
    const code = req.params.colonyCode;
    db.run(
      `Update colony SET disable=? where colonyCode = ?`,
      [0, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/colony");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};

// Delete Colony
exports.deleteColony = async (req, res) => {
  const code = req.params.colonyCode;
  try {
    db.run("Delete from colony WHERE colonyCode = ?", [code], (err) => {
      if (err) {
        console.error("Error in Deletion ", err);
      } else {
        res.redirect("/colony");
      }
    });
  } catch (err) {}
};
