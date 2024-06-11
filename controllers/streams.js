const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");
const DBHelper = require("../database/DBHelper");

const getStream = async (req,res,next)=>{

    const dbHelper = new DBHelper({ db: req.params.base, request: req });
    let queryObj = {};

    const data = await dbHelper.get(req.query.collection,{});


    res.setHeader("Content-Type", [
      "text/vnd.turbo-stream.html",
      "charset=utf-8",
    ]);
  
    res.render(`./partials/streams/${req.params.name}`, {
        layout:"./layouts/stream",
        query:req.query,
        stream:true,
        data:data
    });

}

module.exports = {
    getStream
};