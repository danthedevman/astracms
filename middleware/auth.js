const DBConnection = require("../database/DBConnection");

const isLoggedIn = async (req, res, next) => {

  if (req.oidc.isAuthenticated()) {
    const email = req.oidc.user.email; 
    const db = await DBConnection.getDB(process.env.MAIN_DB);
    let user = await db.collection("sys_user").findOne({email:email});
    if(user){
        console.log(`Found an existing user ${user.email}`)
        req.user = user;
        return next();
    }

    req.session = {};
    req.session.returnTo = req.originalUrl;
    return res.redirect("/register");
  }

  req.session = {};
  req.session.returnTo = req.originalUrl;
  return res.redirect("/login");
};

module.exports = { isLoggedIn };
