const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");
const FileUtil = require("../utils/FileUtil");

const getAssets = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const assets = await db.collection("sys_asset").find({}).sort({sys_created:-1}).toArray();

  res.render("./pages/assets", {
    title: "Assets",
    layout: "./layouts/base",
    path: "assets",
    assets:assets,
    navbar_actions: [{ name: "add_asset", order: 100 }]
  });
};

const uploadAsset = async (req, res, next) => {
  if(!req.params || !req.params.base){
    res.status(503).send();
    return;
  }
  const fileUtil = new FileUtil();
  const file = req.file;
  await fileUtil.upload(`${req.params.base}__${file.originalname}`,file);
 // console.log(file)
 
  const db = await DBConnection.getDB(req.params.base);
  await db.createCollection("sys_asset");
  let asset = await db.collection("sys_asset").insertOne({
    name: file.originalname,
    sys_created_by: new ObjectId(req.user._id),
    sys_created: new Date(),
    mimetype:file.mimetype
  });

  res.status(200).send({sys_asset:asset._id});
};

module.exports = {
  getAssets,
  uploadAsset
};