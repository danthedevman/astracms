const ObjectId = require("mongodb").ObjectId;
const e = require("express");
const DBConnection = require("../database/DBConnection");
const DBHelper = require("../database/DBHelper");
const contentRecordStatusMap = {
  draft: "Draft",
  unpublished: "Unpublished",
  published: "Published",
};

const getContent = async (req, res, next) => {
  const dbHelper = new DBHelper({ db: req.params.base, request: req });
  const queryObj = {};
  let model;

  if (req.params.model && ObjectId.isValid(req.params.model)) {
    queryObj._model = new ObjectId(req.params.model);
    model = await dbHelper.get("sys_model", {
      _id: new ObjectId(req.params.model),
    });
  }

  if(!model){
    res.status(404);
    res.send();
    return;
  }

  const records = await dbHelper.query("sys_content", queryObj);
  let fields = [
    { name: "_title", label: "Title" },
    { name: "_model", label: "Model", type: "reference" },
    { name: "_status", label: "Status", type: "single_line_text" },
  ];

  for (let rec of records) {
    if (rec._status) {
      rec._status = contentRecordStatusMap[rec._status];
    } else {
      rec._status = contentRecordStatusMap["draft"];
    }
  }

  if (model && queryObj._model) {
    fields = await dbHelper.query("sys_field", {
      _model: new ObjectId(model._id),
    });
  }

  for (const record of records) {
    if (!record._title) {
      record._title = "-No title found-";
    }

    for (const field of fields) {
      if (field.type === "yes_no" && field.title_field === "yes") {
        record[field.name] =
          String(record[field.name])[0].toUpperCase() +
          String(record[field.name]).slice(1);
      }

      if (field.type === "reference") {
        if (!record[field.name] || !ObjectId.isValid(record[field.name]))
          continue;
        let refCollection = model ? "sys_content" : "sys_model";
        if (!refCollection) continue;
        let refVal = await dbHelper.get(refCollection, {
          _id: new ObjectId(record[field.name]),
        });
        if (!refVal) continue;
        record[field.name] = {
          value: refVal._id.toString(),
          display_value: refVal._title,
        };
      }

      if (field.type === "asset") {
        field.reference_model = "sys_asset";
        if (!record[field.name] || !ObjectId.isValid(record[field.name]))
          continue;
        let refVal = await dbHelper.get("sys_asset", {
          _id: new ObjectId(record[field.name]),
        });
        if (!refVal) continue;
        record[field.name] = {
          value: refVal._id.toString(),
          display_value: refVal._title,
        };
      }
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
    contentRecordStatusMap: contentRecordStatusMap,
  };

  if (req.params.model) {
    renderObj.navbar_actions = [{ name: "add_content", order: 100 }];
    renderObj.crumbs = [
      { label: "Content", href: `content` },
      { label: `${model.label}` },
    ];
  }

let renderPath = "./pages/content";

if(req.query.get_stream){
  renderObj.layout = "./layouts/stream";
  renderObj.query = req.query;
  renderObj.stream = true;
  res.setHeader("Content-Type", [
    "text/vnd.turbo-stream.html",
    "charset=utf-8",
  ]);

  renderPath = "./partials/streams/content_table"
}

  res.render(renderPath, renderObj);
};

const getContentRecord = async (req, res, next) => {
  const dbHelper = new DBHelper({ db: req.params.base, request: req });

  const model = await dbHelper.get("sys_model", {
    _id: new ObjectId(req.params.model),
  });

  let record;
  let fields;
  if (req.params.id && ObjectId.isValid(req.params.id)) {
    record = await dbHelper.get("sys_content", {
      _id: new ObjectId(req.params.id),
    });
    fields = record._fields || [];
  } else {
    fields = await dbHelper.query("sys_field", {
      _model: new ObjectId(req.params.model),
    });
  }

  res.render("./pages/content_record", {
    title: "Content",
    layout: "./layouts/base",
    path: "content",
    record: record,
    fields: fields,
    model: model,
    navbar_actions: [{ name: "content_record_actions", order: 100 }],
    crumbs: [
      { label: "Content", href: `content` },
      { label: `${model.label}`, href: `content/${model._id}` },
      {
        label: `${
          (record && (record._title ? record._title : "No title found")) ||
          "New"
        }`,
      },
    ],
  });
};

const saveContentRecord = async (req, res, next) => {
  if (!req.body || !req.params.base) {
    res.status(503).send();
    return;
  }

  const dbHelper = new DBHelper({ db: req.params.base, request: req });
  const fields = await dbHelper.query("sys_field", {
    _model: new ObjectId(req.params.model),
  });

  let titleField = fields.filter((f) => {
    return f.title_field === "yes";
  })[0];
  if (!titleField) {
    titleField = fields[0];
  }

  const saveData = {};
  for (let field of fields) {
    saveData[field.name] = req.body[field.name];
  }

  saveData._title = req.body[titleField.name];

  if (titleField.type === "yes_no") {
    saveData._title =
      String(req.body[titleField.name])[0].toUpperCase() +
      String(req.body[titleField.name]).slice(1);
  }

  saveData._model = new ObjectId(req.params.model);

  let contentQuery;
  let isValidRecord = req.params.id && ObjectId.isValid(req.params.id);
  if (isValidRecord) {
    contentQuery = {
      _id: new ObjectId(req.params.id),
    };
  }

  if (req.body._status === "published") {
    saveData._status = "published";
    saveData._published_changes = true;
  }

  if (req.body._status === "unpublished") {
    saveData._status = "unpublished";
  }

  if (!req.body._status) {
    saveData._published_changes = false;
  }

  const contentRecord = await dbHelper.save(
    "sys_content",
    contentQuery,
    saveData
  );

  res.status(200).send({
    record_id: contentRecord,
  });
};

const deleteContentRecord = async (req, res, next) => {
  if (!req.params.base || !req.params.id || !ObjectId.isValid(req.params.id)) {
    res.status(503).send();
    return;
  }

  const db = await DBConnection.getDB(req.params.base);
  await db
    .collection("sys_content")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
};

function _prepRecordRead(record) {}

module.exports = {
  getContent,
  getContentRecord,
  saveContentRecord,
  deleteContentRecord,
};
