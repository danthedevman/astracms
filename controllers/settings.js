const getSettings = (req,res,next)=>{
    
    res.render("./pages/settings", {
        title: "Settings",
        layout: "./layouts/base",
        path:"settings"
      });
};

module.exports = {
    getSettings
  };