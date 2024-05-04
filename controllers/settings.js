const getSettings = (req,res,next)=>{
    res.render("./pages/settings", {
        title: "Settings",
        layout: "./layouts/default",
        path:"settings"
      });
};

module.exports = {
    getSettings
  };