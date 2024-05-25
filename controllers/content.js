const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");

const getContent = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const records = await db.collection("sys_content").find({}).toArray();
  const models = await db.collection("sys_model").find({}).toArray();

  res.render("./pages/content", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    records: records,
    models: models,
    navbar_actions: [{ name: "add_content_all", order: 100 }],
    crumbs: [{ label: "Content" }],
  });
};

const getContentByModel = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const records = await db
    .collection("sys_content")
    .find({ _model: new ObjectId(req.params.model) })
    .toArray();

  const model = await db
    .collection("sys_model")
    .findOne({ _id: new ObjectId(req.params.model) });

  const fields = await db
    .collection("sys_field")
    .find({ _model: new ObjectId(req.params.model) })
    .toArray();

  res.render("./pages/content_by_model", {
    title: "Content",
    layout: "./layouts/base",
    records: records,
    model: model,
    fields: fields,
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
    .find({ _model: new ObjectId(req.params.model) })
    .toArray();

  let record;
  if(req.params.id && ObjectId.isValid(req.params.id)){
    record = await db.collection("sys_content")
    .findOne({ _id: new ObjectId(req.params.id) }); 
  }

  res.render("./pages/content_record", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    record: record,
    model: model,
    fields: fields,
    navbar_actions: [{ name: "content_record_actions", order: 100 }],
    // navbar_actions: [{ name: "save", order: 100 }],
    crumbs: [
      { label: "Content", href: `content` },
      { label: `${model.label}` , href: `content/${model._id}`},
      {label:`${record._title}`}
    ],
  });
};

const saveContent = async (req, res, next) => {
  if (!req.body || !req.params.base) {
    res.status(503).send();
    return;
  }

  const db = await DBConnection.getDB(req.params.base);

  const fields = await db
    .collection("sys_field")
    .find({ _model: new ObjectId(req.params.model) })
    .toArray();

  let titleField = fields.filter((f)=>{return f.title === "yes"})[0];
  if(!titleField){
    titleField = fields[0];
  }

  const saveData = {};
  for (let field of fields) {
    saveData[field.name] = req.body[field.name];
  }

  saveData._title =  req.body[titleField.name];
  saveData._model =  new ObjectId(req.params.model);
  console.log(saveData);

  const contentCollection = await db.collection("sys_content");

  if (req.params.id && ObjectId.isValid(req.params.id)) {
    contentRecord = await contentCollection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      { $set: saveData }
    );
  } else {
    contentRecord = await contentCollection.insertOne(saveData);
  }

  console.log(contentRecord);
  res
    .status(200)
    .send({
      record_id:
        (contentRecord && contentRecord._id) ||
        (contentRecord && contentRecord.insertedId),
    });
};

module.exports = {
  getContent,
  getContentByModel,
  getContentRecord,
  saveContent,
};
