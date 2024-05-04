const getModels = (req,res,next)=>{
    res.render("./pages/models", {
        title: "Models",
        layout: "./layouts/default",
        path:"models"
      });
};

module.exports = {
    getModels
  };