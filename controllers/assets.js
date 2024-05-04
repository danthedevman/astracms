const getAssets= (req,res,next)=>{
    res.render("./pages/assets", {
        title: "Assets",
        layout: "./layouts/default",
        path:"assets"
      });
};

module.exports = {
    getAssets
  };