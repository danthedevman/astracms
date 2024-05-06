const getModels = (req,res,next)=>{
    res.render("./pages/models", {
        title: "Models",
        layout: "./layouts/base",
        path:"models"
      });
};

module.exports = {
    getModels
  };