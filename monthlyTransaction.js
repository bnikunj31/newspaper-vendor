const cron = require("node-cron");
const http = require("http");

cron.schedule("59 23 28-31 * *", () => {
  const currentDate = new Date();
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  if (currentDate.getDate() === lastDay) {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/calculateDue",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (data1) => {
        data += data1;
      });

      res.on("end", () => {
        console.log(
          "Monthly transaction summary job executed successfully:",
          data
        );
      });
    });

    req.on("error", (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    req.end();
  }
});
