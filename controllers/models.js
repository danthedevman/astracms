const getModels = (req,res,next)=>{
    res.render("./pages/models", {
        title: "Models",
        layout: "./layouts/base",
        path:"models",
        navbar_actions:[{name:"add_model",order:100}]
      });
};

module.exports = {
    getModels
  };