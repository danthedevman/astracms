const DBConnection = require("../database/DBConnection");
const ObjectId = require("mongodb").ObjectId;
const canAccessBase = async (req, res, next) => {
    const base = req.params.base;
    if(!ObjectId.isValid(base)){
        console.log(base)
        res.redirect("/");
        return;
    }
    const db = await DBConnection.getDB(base);

    return next();
  };
  
  module.exports = { canAccessBase };
  