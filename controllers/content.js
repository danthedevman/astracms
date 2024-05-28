const ObjectId = require("mongodb").ObjectId;
const e = require("express");
const DBConnection = require("../database/DBConnection");
const DBHelper = require("../database/DBHelper");

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

  const records = await dbHelper.query("sys_content", queryObj);
  let fields = [
    { name: "_title", label: "Title" },
    { name: "_model", label: "Model", type: "reference" },
  ];
  if (model) {
    fields = await dbHelper.query("sys_field", {
      _model: new ObjectId(model._id),
    });
  }

  let referenceFields = fields.filter((f) => {
    return f.type === "reference";
  });

  for (const record of records) {
    if (!record._title) {
      record._title = "-No title found-";
    }

    for (const field of fields) {

      if(field.type === "yes_no" && field.title_field === "yes"){
        record[field.name] = String(record[field.name])[0].toUpperCase() + String(record[field.name]).slice(1);
        ;
      }

      if (field.type === "reference") {
        if (!record[field.name] || !ObjectId.isValid(record[field.name]))
          continue;
          let refCollection = model ? "sys_content" : "sys_model";
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

    /*for (const field of referenceFields) {
      if (!record[field.name] || !ObjectId.isValid(record[field.name]))
        continue;
      let refCollection = model ? "sys_content" : "sys_model";
      let refVal = await dbHelper.get(refCollection, {
        _id: new ObjectId(record[field.name]),
      });
      if (!refVal) continue;
      record[field.name] = {
        value: refVal._id.toString(),
        display_value: refVal._title,
      };
    }*/
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

  if (req.params.model) {
    renderObj.navbar_actions = [{ name: "add_content", order: 100 }];
    renderObj.crumbs = [
      { label: "Content", href: `content` },
      { label: `${model.label}` },
    ];
  }

  res.render("./pages/content", renderObj);
};

const getContentRecord = async (req, res, next) => {
  const dbHelper = new DBHelper({ db: req.params.base });

  const model = await dbHelper.get("sys_model", {
    _id: new ObjectId(req.params.model),
  });

  const fields = await dbHelper.query("sys_field", {
    _model: new ObjectId(req.params.model),
  });

  let record;
  if (req.params.id && ObjectId.isValid(req.params.id)) {
    record = await dbHelper.get("sys_content", {
      _id: new ObjectId(req.params.id),
    });
  }

  if (record) {
    for (const field of fields) {

      if (field.type === "reference") {
        if (!record[field.name] || !ObjectId.isValid(record[field.name]))
          continue;
        let refVal = await dbHelper.get("sys_content", {
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
  } else {
    for (const field of fields) {
      if (field.type !== "asset") continue;
      field.reference_model = "sys_asset";
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
      {
        label: `${
          (record && (record._title ? record._title : "No title found")) ||
          "New"
        }`,
      },
    ],
  });
};

const saveContent = async (req, res, next) => {
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

  if(titleField.type === "yes_no"){
    saveData._title = String(req.body[titleField.name])[0].toUpperCase() + String(req.body[titleField.name]).slice(1);
  }

  saveData._model = new ObjectId(req.params.model);

  let contentQuery;
  let isValidRecord = req.params.id && ObjectId.isValid(req.params.id);
  if (isValidRecord) {
    contentQuery = {
      _id: new ObjectId(req.params.id),
    };
  }

  if(req.body._status === "published"){
    saveData._status = "published";
    saveData._published_changes = true;
  }

  if(!req.body._status){
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

function _prepRecordRead(record){
  

}

module.exports = {
  getContent,
  getContentRecord,
  saveContent,
};
