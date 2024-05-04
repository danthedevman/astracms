const getUsers = (req,res,next)=>{
    res.render("./pages/users", {
        title: "Users",
        layout: "./layouts/default",
        path:"users"
      });
};

module.exports = {
    getUsers
};