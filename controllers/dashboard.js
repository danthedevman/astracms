const DBConnection = require("../database/DBConnection");

const getDashboard = async (req,res,next)=>{
 
    res.render("./pages/dashboard", {
        title: "Dashboard",
        layout: "./layouts/base",
        path:"dashboard"
      });
};

module.exports = {
    getDashboard
  };