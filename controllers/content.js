const getContent= (req,res,next)=>{
    res.render("./pages/content", {
        title: "Content",
        layout: "./layouts/base",
        path:"content"
      });
};

const getContentByModel = (req,res,next)=>{
    res.render("./pages/content_by_model", {
        title: "Content",
        layout: "./layouts/base",
        path:"content"
      });
};

module.exports = {
    getContent,
    getContentByModel
  };