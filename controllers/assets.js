const getAssets= (req,res,next)=>{
    res.render("./pages/assets", {
        title: "Assets",
        layout: "./layouts/base",
        path:"assets"
      });
};

module.exports = {
    getAssets
  };