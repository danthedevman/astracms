const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");

const getModels = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const models = await db.collection("sys_model").find({}).toArray();
  res.render("./pages/models", {
    title: "Models",
    layout: "./layouts/base",
    models: models,
    path: "models",
    navbar_actions: [{ name: "add_model", order: 100 }],
    crumbs:[{label:"Models"}]
  });
};

const getModel = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const model = await db.collection("sys_model").findOne({_id:new ObjectId(req.params.id)});
  res.render("./pages/model", {
    title: `Model - ${model.name}`,
    layout: "./layouts/base",
    model: model,
    path: "models",
    navbar_actions: [{name:"model_actions"}],
    crumbs:[{label:"Models",href:`models`},{label:`${model.name}`}]
  });
};

const createModel = async (req, res, next) => {
  if (!req.body || !req.params.base) {
    res.status(503).send();
    return;
  }
  const db = await DBConnection.getDB(req.params.base);
  await db.createCollection("sys_model");
  let model = await db.collection("sys_model").insertOne({
    name: req.body.name,
    sys_created_by: new ObjectId(req.user._id),
    description: req.body.description,
    sys_created: new Date(),
  });

  if (model) res.status(200).send({ record_id: String(model.insertedId) });
};

const deleteModel = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const model = await db.collection("sys_model").deleteOne({_id:new ObjectId(req.params.id)});
  res.status(200).send();
};

module.exports = {
  getModels,
  getModel,
  createModel,
  deleteModel
};
