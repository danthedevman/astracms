const getAssets= (req,res,next)=>{
    res.render("./pages/assets", {
        title: "Assets",
        layout: "./layouts/base",
        path:"assets",
        navbar_actions:[{name:"add_asset",order:100}]
      });
};

module.exports = {
    getAssets
  };