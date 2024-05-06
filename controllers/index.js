const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");

const getBases = async (req, res, next) => {
  const db = await DBConnection.getDB(process.env.MAIN_DB);
  const bases = await db.collection("sys_base").find({user:new ObjectId(req.user._id)}).toArray();
  res.render("./pages/bases", {
    title: "Bases",
    layout: "./layouts/bases",
    path: "bases",
    bases:bases
  });
};

const createBase = async (req, res, next) => {
  if(!req.body){
    res.status(503).send();
    return;
  }
  console.log("Creating Base");
  const db = await DBConnection.getDB(process.env.MAIN_DB);
  await db.createCollection("sys_base");
  let base = await db.collection("sys_base").insertOne({
    name: req.body.name,
    user: new ObjectId(req.user._id),
    description: req.body.description,
    sys_created: new Date(),
  });

  if (base) res.status(200).send({ sys_base: String(base._id) });
};

module.exports = {
  getBases,
  createBase,
};
