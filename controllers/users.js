const getUsers = (req,res,next)=>{
    res.render("./pages/users", {
        title: "Users",
        layout: "./layouts/base",
        path:"users"
      });
};

module.exports = {
    getUsers
};