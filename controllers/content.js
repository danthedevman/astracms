const getContent= (req,res,next)=>{
    res.render("./pages/content", {
        title: "Content",
        layout: "./layouts/default",
        path:"content"
      });
};

module.exports = {
    getContent
  };