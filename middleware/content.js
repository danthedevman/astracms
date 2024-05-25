const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");
const contentMiddleware = async (req, res, next) => {
    const baseId = req.params.base;
    const db = await DBConnection.getDB(baseId);
    const models = await db.collection("sys_model").find({}).toArray();
    res.locals.models = models;
    return next();
    
  };
  
  module.exports = { contentMiddleware };
  