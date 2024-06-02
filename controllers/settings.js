const getSettings = (req,res,next)=>{
    
    res.render("./pages/settings/general", {
        title: "General Settings",
        layout: "./layouts/base",
        path:"settings"
      });
};

module.exports = {
    getSettings
  };