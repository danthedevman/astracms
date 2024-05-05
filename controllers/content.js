const getContent= (req,res,next)=>{
    res.render("./pages/content", {
        title: "Content",
        layout: "./layouts/default",
        path:"content"
      });
};

const getContentByModel = (req,res,next)=>{
    res.render("./pages/content_by_model", {
        title: "Content",
        layout: "./layouts/default",
        path:"content"
      });
};

module.exports = {
    getContent,
    getContentByModel
  };