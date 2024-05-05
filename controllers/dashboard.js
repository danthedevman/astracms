const getDashboard = (req,res,next)=>{
    res.render("./pages/dashboard", {
        title: "Dashboard",
        layout: "./layouts/base",
        path:"dashboard"
      });
};

module.exports = {
    getDashboard
  };