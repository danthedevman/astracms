const getBases = (req,res,next)=>{
    res.render("./pages/bases", {
        title: "Bases",
        layout: "./layouts/bases",
        path:"bases"
      });
};

module.exports = {
    getBases
  };