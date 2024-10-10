const db = require("../config/db");

// Show Days Combinations
exports.showDays = async (req, res) => {
  try {
    db.all("Select * from days", [], (err, rows) => {
      if (err) {
        console.error("Error in fetching errors: ", err);
      } else {
        res.render("Days/showDays", { rows: rows });
      }
    });
  } catch (err) {
    console.error("Error in Days: ", err);
  }
};

// Add Days Combinations
exports.addDaysForm = async (req, res) => {
  try {
    res.render("Days/addDays", { error: "" });
  } catch (err) {
    console.error("Error in Displaying Form: ", err);
  }
};

exports.addDays = async (req, res) => {
  try {
    const { days } = req.body;
    if (!Array.isArray(days) || days.length === 0) {
      return res.render("Days/addDays", {
        error: "Select at least 1 day.",
      });
    }
    const data = days.join(", ");
    db.run("Insert into days (combinationDays) Values (?)", [data], (err) => {
      if (err) {
        console.error("Error in inserting Combinations: ", err);
      } else {
        res.redirect("/days");
      }
    });
  } catch (err) {
    console.error("Error in adding Days: ", err);
  }
};

// Update Days Combinations
exports.updateDaysForm = async (req, res) => {
  const id = req.params.id;
  try {
    db.get(`Select * from days where combinationId = ?`, [id], (err, rows) => {
      if (err) {
        console.error("Error in fetching data: ", err);
      } else {
        if (rows) {
          res.render("Days/updateDays", { rows: rows });
        }
      }
    });
  } catch (err) {
    console.error("Error Displaying update form for days: ", err);
  }
};

exports.updateDays = async (req, res) => {
  try {
    const { id, days } = req.body;
    console.log(id, days);
    const data = days.join(", ");
    db.run(
      "Update days SET combinationDays=? Where combinationId = ?",
      [data, id],
      (err) => {
        if (err) {
          console.error("Error while updating days: ", err);
        } else {
          res.redirect("/days");
        }
      }
    );
  } catch (err) {
    console.error("Error in updating Days: ", err);
  }
};

// Delete Combination
exports.deleteCombination = async (req, res) => {
  const id = req.params.id;
  try {
    db.run("DELETE FROM days WHERE combinationId = ?", [id], (err) => {
      if (err) {
        console.error("Error in deleting combinations of days: ", err);
      } else {
        res.redirect("/days");
      }
    });
  } catch (err) {
    console.error("Error in deleting combination: ", err);
  }
};

// Disable Colony
exports.disable = async (req, res) => {
  try {
    const code = req.params.id;
    db.run(
      `Update days SET disable=? where combinationId = ?`,
      [1, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/days");
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
      `Update days SET disable=? where combinationId = ?`,
      [0, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/days");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};
