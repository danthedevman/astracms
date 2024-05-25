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
    crumbs: [{ label: "Models" }],
  });
};

const getModel = async (req, res, next) => {
  if(!ObjectId.isValid(req.params.id)){
    return res.redirect(`/${req.params.base}/models`);
  }
  const db = await DBConnection.getDB(req.params.base);
  const model = await db
    .collection("sys_model")
    .findOne({ _id: new ObjectId(req.params.id) });

const fields =  await db.collection("sys_field").find({ _model: new ObjectId(req.params.id) }).toArray();

  res.render("./pages/model", {
    title: `Model - ${model.name}`,
    layout: "./layouts/base",
    model: model,
    fields:fields,
    path: "models",
    navbar_actions: [{ name: "model_actions" }],
    crumbs: [{ label: "Models", href: `models` }, { label: `${model.label}` }],
  });
};

const saveModel = async (req, res, next) => {
  if (!req.body || !req.params.base) {
    res.status(503).send();
    return;
  }
  let model;
  const db = await DBConnection.getDB(req.params.base);
  const modelCollection = await db.collection("sys_model");
  const saveData = {
    label: req.body.label,
    name: req.body.name,
    sys_created_by: new ObjectId(req.user._id),
    description: req.body.description,
    sys_created: new Date(),
  };

  if (req.params.id && ObjectId.isValid(req.params.id)) {
    model = await modelCollection.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    },{ $set:saveData});
  } else {
    model = await modelCollection.insertOne(saveData);
  }

  console.log(model)
  if (model)
    res
      .status(200)
      .send({ record_id: model && model._id || model && model.insertedId});
};

const deleteModel = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  await db.collection("sys_field").deleteMany({ _model: new ObjectId(req.params.id) });
  await db
    .collection("_model")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
};


const saveField = async (req,res,next) => {
  if (!req.body || !req.params.base || !req.params.id || !ObjectId.isValid(req.params.id)) {
    res.status(503).send();
    return;
  }
  let field;
  const db = await DBConnection.getDB(req.params.base);
  const modelCollection = await db.collection("sys_model");
  const model = await modelCollection.findOne({_id:new ObjectId(req.params.id)});
  if(!model){
    return res.status(404).send({});
  }

  const fieldCollection = await db.collection("sys_field");
  const saveData = req.body;
  saveData._model = new ObjectId(req.params.id);

  if (saveData.field_id && ObjectId.isValid(saveData.field_id)) {
    field = await fieldCollection.findOneAndUpdate({
      _id: new ObjectId(saveData.field_id),
    },{ $set:saveData});
  } else {
    field = await fieldCollection.insertOne(saveData);
  }

  if (field)
    res
      .status(200)
      .send({ record_id: model && model._id});
};

const deleteField = async (req,res,next) => {
  if (!req.params.base || !req.params.field_id || !ObjectId.isValid(req.params.field_id)) {
    res.status(503).send();
    return;
  }

  const db = await DBConnection.getDB(req.params.base);
  await db.collection("sys_field").deleteOne({ _id: new ObjectId(req.params.field_id) });
    res
      .status(200)
      .send();
};


function _getFieldData(data){
  let answer = {};
  answer.label = data.label;
  answer.name = data.name;
}

module.exports = {
  getModels,
  getModel,
  saveModel,
  deleteModel,
  saveField,
  deleteField,
};
