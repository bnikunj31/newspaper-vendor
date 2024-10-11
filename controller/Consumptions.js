const db = require("../config/db");

// Show Consumptions
exports.showConsumptions = async (req, res) => {
  try {
    db.all(
      `SELECT c.consumptionId, c.disable, cu.customerName, n.newspaperName, d.combinationDays, c.isActive
       FROM consumption c 
       JOIN customer cu ON c.customerId = cu.customerId 
       JOIN days d ON c.combinations = d.combinationId
       JOIN newspaper n ON c.newspaperId = n.newspaperId`,
      (err, consumptions) => {
        if (err) {
          console.error("Error in fetching consumptions: ", err);
        } else {
          res.render("Consumptions/showConsumptions", {
            consumptions: consumptions,
          });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing consumptions: ", err);
  }
};

// Add Consumptions
exports.addConsumptionForm = async (req, res) => {
  try {
    db.all(
      `SELECT customerId as id, customerName as name, 'Customer' as type,  NULL as combinationId FROM customer 
      UNION ALL
      SELECT newspaperId as id, newspaperName as name, 'Newspaper' as type, combinationId FROM newspaper
      UNION ALL
      SELECT combinationId as id, combinationDays as name, 'Days' as type,  NULL as combinationId  FROM days
      UNION ALL
      SELECT colonyCode as id, colonyName as name, 'Colony' as type,  NULL as combinationId  FROM colony`,
      (err, data) => {
        if (err) {
          console.error("Error in displaying consumption add form ", err);
        } else {
          console.log(data);
          res.render("Consumptions/addConsumptions", { data: data });
        }
      }
    );
  } catch (err) {
    console.error("Error in showing consumer add form ", err);
  }
};

exports.addConsumption = async (req, res) => {
  try {
    const { colony, customerId, newspaperId, days } = req.body;
    db.run(
      "Insert into consumption (colonyCode, customerId, newspaperId, combinations) VALUES (?,?,?,?)",
      [colony, customerId, newspaperId, days],
      (err) => {
        if (err) {
          console.error("Error in Inserting Consumptions: ", err);
        } else {
          res.redirect("/consumptions");
        }
      }
    );
  } catch (err) {
    console.error("Error in Adding consumptions: ", err);
  }
};

// Update Consumptions
exports.updateConsumptionForm = async (req, res) => {
  try {
    const id = req.params.id;
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
          console.error("Error in showing consumption update form ", err);
        } else {
          db.get(
            "SELECT * FROM consumption WHERE consumptionId = ?",
            id,
            (err, consumption) => {
              if (err) {
                console.error("Error in fetching consumer: ", err);
              } else {
                res.render("Consumptions/updateConsumptions", {
                  data: data,
                  consumption: consumption,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error in showing consumer update form ", err);
  }
};

exports.updateConsumption = async (req, res) => {
  try {
    const { id, colony, newspaperCode, days, status } = req.body;
    console.log(req.body);
    db.run(
      "Update consumption SET colonyCode = ?, newspaperId = ?, Combinations = ?, isActive = ? where consumptionId = ?",
      [colony, newspaperCode, days, status[0], id],
      (err) => {
        if (err) {
          console.error("Error in Updating consumptions: ", err);
        } else {
          res.redirect("/consumptions");
        }
      }
    );
  } catch (err) {
    console.error("Error in updating consumption: ", err);
  }
};

// Delete Consumptions
exports.deleteConsumption = async (req, res) => {
  try {
    const id = req.params.id;
    db.run("Delete from consumption where consumptionId = ?", [id], (err) => {
      if (err) {
        console.error("Error in deleting consumptions: ", err);
      } else {
        res.redirect("/consumptions");
      }
    });
  } catch (err) {
    console.error("Error in deletion of consumer: ", err);
  }
};

// Disable Colony
exports.disable = async (req, res) => {
  try {
    const code = req.params.id;
    db.run(
      `Update consumption SET disable=? where consumptionId = ?`,
      [1, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/consumptions");
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
      `Update consumption SET disable=? where consumptionId = ?`,
      [0, code],
      (err) => {
        if (err) {
          console.error("Cannot disable colony: ", err);
        } else {
          res.redirect("/consumptions");
        }
      }
    );
  } catch (err) {
    console.error("Error in Disabling colony: ", err);
  }
};
