const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");

const getContent = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const queryObj = {};
  let model;

  if(req.params.model && ObjectId.isValid(req.params.model)){
    queryObj._model = new ObjectId(req.params.model);
    model = await db
    .collection("sys_model")
    .findOne({ _id: new ObjectId(req.params.model) });
  }

  const records = await db
  .collection("sys_content")
  .find(queryObj)
  .toArray();
  

  const fields = [
    { name: "_title", label: "Title" },
  ];

  for(const rec of records){
    if(!rec._title){
      rec._title = '-No title found-';
    }
  }

  let renderObj = {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    records: records,
    model: model,
    fields: fields,
    navbar_actions: [{ name: "add_content_all", order: 100 }],
    crumbs: [{ label: "Content" }],
  };

  if(req.params.model){
    renderObj.navbar_actions= [{ name: "add_content", order: 100 }];
    renderObj.crumbs = [
      { label: "Content", href: `content` },
      { label: `${model.label}` },
    ];
  }

  res.render("./pages/content", renderObj);
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
  if (req.params.id && ObjectId.isValid(req.params.id)) {
    record = await db
      .collection("sys_content")
      .findOne({ _id: new ObjectId(req.params.id) });
  }

  if(record){
    let referenceFields = fields.filter((f)=>{return f.type === "reference"});
    for(const field of referenceFields){
      if(!record[field.name] || !ObjectId.isValid(record[field.name])) continue;
      let refVal = await db
      .collection("sys_content")
      .findOne({ _id: new ObjectId(record[field.name])/*, _model:new ObjectId(field.reference_model)*/ });
      if(!refVal) continue;
      record[field.name] = {value:refVal._id.toString(),display_value:refVal._title}
    }
  }

  res.render("./pages/content_record", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    record: record,
    model: model,
    fields: fields,
    navbar_actions: [{ name: "content_record_actions", order: 100 }],
    crumbs: [
      { label: "Content", href: `content` },
      { label: `${model.label}`, href: `content/${model._id}` },
      { label: `${(record && (record._title ? record._title : 'No title found')) || "New"}` },
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

  let titleField = fields.filter((f) => {
    return f.title === "yes";
  })[0];
  if (!titleField) {
    titleField = fields[0];
  }

  const saveData = {};
  for (let field of fields) {
    saveData[field.name] = req.body[field.name];
  }

  saveData._title = req.body[titleField.name];
  saveData._model = new ObjectId(req.params.model);
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
  res.status(200).send({
    record_id:
      (contentRecord && contentRecord._id) ||
      (contentRecord && contentRecord.insertedId),
  });
};

module.exports = {
  getContent,
  getContentRecord,
  saveContent,
};
