const getContent= (req,res,next)=>{
    res.render("./pages/content", {
        title: "Content",
        layout: "./layouts/base",
        path:"content",
        navbar_actions:[{name:"add_content_all"}]
      });
};

const getContentByModel = (req,res,next)=>{
    res.render("./pages/content_by_model", {
        title: "Content",
        layout: "./layouts/base",
        path:"content",
        navbar_actions:[{name:"add_content_all"}]
      });
};

module.exports = {
    getContent,
    getContentByModel
  };