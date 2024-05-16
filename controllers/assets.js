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
    navbar_actions: [{ name: "add_asset", order: 100 }],
    crumbs:[{label:"Assets"}]
  });
};

const uploadAsset = async (req, res, next) => {
  if(!req.params || !req.params.base){
    res.status(503).send();
    return;
  }
 // console.log(file)
  const file = req.file;
  const db = await DBConnection.getDB(req.params.base);
  await db.createCollection("sys_asset");
  let asset = await db.collection("sys_asset").insertOne({
    name: file.originalname,
    sys_created_by: new ObjectId(req.user._id),
    sys_created: new Date(),
    mimetype:file.mimetype
  });

  if(asset && asset.insertedId){
  const fileUtil = new FileUtil();
  await fileUtil.upload(`${req.params.base}${asset.insertedId}`,file);
  }

  res.status(200).send({sys_asset:asset.insertedId});
};

const deleteAsset = async (req, res, next) => {
  if(!req.params || !req.params.base){
    res.status(503).send();
    return;
  }

  console.log(req.params.id)
  const db = await DBConnection.getDB(req.params.base);
  const asset = await db.collection("sys_asset").findOne({_id:new ObjectId(req.params.id)});
  const fileUtil = new FileUtil();
  await fileUtil.delete(`${req.params.base}_${asset._id}`);

  await db.collection("sys_asset").deleteOne({_id:new ObjectId(asset._id)});
  console.log("deleted asset")
  res.status(200).send();
};

module.exports = {
  getAssets,
  uploadAsset,
  deleteAsset
};