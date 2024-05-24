const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");

const getContent = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const contentRecords = await db.collection("sys_content").find({}).toArray();
  const models = await db.collection("sys_model").find({}).toArray();

  res.render("./pages/content", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    contentRecords: contentRecords,
    models: models,
    navbar_actions: [{ name: "add_content_all", order: 100 }],
    crumbs: [{ label: "Content" }],
  });
};

const getContentByModel = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const contentRecords = await db
    .collection("sys_content")
    .find({ model: req.params.model })
    .toArray();

  const model = await db
    .collection("sys_model")
    .findOne({ _id: new ObjectId(req.params.model) });

  const fields = await db
    .collection("sys_field")
    .find({ sys_model: new ObjectId(req.params.model) })
    .toArray();

  res.render("./pages/content_by_model", {
    title: "Content",
    layout: "./layouts/base",
    contentRecords: contentRecords,
    model:model,
    fields:fields,
    path: "content",
    navbar_actions: [{ name: "add_content", order: 100 }],
    crumbs: [
      { label: "Content", href: `content` },
      { label: `${model.label}` },
    ],
  });
};

const getContentRecord = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);

  const model = await db
    .collection("sys_model")
    .findOne({ _id: new ObjectId(req.params.model) });

  const fields = await db
    .collection("sys_field")
    .find({ sys_model: new ObjectId(req.params.model) })
    .toArray();

  res.render("./pages/content_record", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    record:undefined,
    model: model,
    fields:fields,
    navbar_actions: [{ name: "content_record_actions", order: 100 }],
   // navbar_actions: [{ name: "save", order: 100 }],
    crumbs: [
      { label: "Content", href: `content` },
      { label: `${model.label}` },
    ],
  });
};

const saveContent = async (req, res, next) => {
  if (!req.body || !req.params.base) {
    res.status(503).send();
    return;
  }
  console.log("saving")
  console.log(req.body);
  console.log(req.body.title);

  return res
  .status(200)
  .send();

  let model;
  const db = await DBConnection.getDB(req.params.base);
  const contentCollection = await db.collection("sys_content");
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


module.exports = {
  getContent,
  getContentByModel,
  getContentRecord,
  saveContent
};
