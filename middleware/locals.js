const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");
const localMiddleware = async (req, res, next) => {

    const db = await DBConnection.getDB(process.env.MAIN_DB);
    const bases = await db.collection("sys_base").find({users:new ObjectId(req.user._id)}).toArray();
    res.locals.bases = bases;
    res.locals.BUCKET_PUBLIC_HOST_URL = process.env.BUCKET_PUBLIC_HOST_URL;
    return next();
    
  };
  
  module.exports = { localMiddleware };
  