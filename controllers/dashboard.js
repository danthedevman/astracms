const DBConnection = require("../database/DBConnection");

const getDashboard = async (req, res, next) => {
  res.render("./pages/dashboard", {
    title: "Dashboard",
    layout: "./layouts/base",
    path: "dashboard",
    crumbs: [{ label: "Dashboard" }],
    dashboard: {
      counts: [
        {
          label: "Total Models",
          count: "10/20",
        },
        {
          label: "Total Content Records",
          count: "100/1000",
        },
        {
          label: "Asset Storage Usage",
          count: "100mb/1GB",
        },
        {
          label: "API Calls this Month",
          count: "100/1000",
        },
        {
          label: "Content Updated Today",
          count: "2 records",
        },
        {
          label: "Total User Seats",
          count: "3/10",
        },
      ],
    },
  });
};

module.exports = {
  getDashboard,
};
