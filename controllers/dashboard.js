const getDashboard = (req,res,next)=>{
    res.render("./dashboard", {
        title: "Dashboard",
        layout: "./layouts/default",
      });
};

module.exports = {
    getDashboard
  };