const getDashboard = (req,res,next)=>{
    res.render("./pages/dashboard", {
        title: "Dashboard",
        layout: "./layouts/default",
        path:"dashboard"
      });
};

module.exports = {
    getDashboard
  };