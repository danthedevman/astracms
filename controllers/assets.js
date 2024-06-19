const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("../database/DBConnection");
const FileUtil = require("../utils/FileUtil");
const DBHelper = require("../database/DBHelper");

const getAssets = async (req, res, next) => {

  const dbHelper = new DBHelper({ db: req.params.base, request: req });
  //const db = await DBConnection.getDB(req.params.base);
  req.query.sort_by = "_updated_on";
  req.query.sort_by_direction = req.query.sort_by_direction || "asc";

  const assets = await dbHelper.query("sys_asset",{},{sort_by:req.query.sort_by,sort_by_direction:req.query.sort_by_direction})

  res.render("./pages/assets", {
    title: "Assets",
    layout: "./layouts/base",
    path: "assets",
    assets: assets,
    navbar_actions: [{ name: "add_asset", order: 100 }],
    sort_by_direction:req.query.sort_by_direction,
    crumbs: [{ label: "Assets" }],
  });
};

const uploadAsset = async (req, res, next) => {
  if (!req.params || !req.params.base) {
    res.status(503).send();
    return;
  }

  let asset;
  const fileUtil = new FileUtil();
  const file = req.file;
  const db = await DBConnection.getDB(req.params.base);
  let new_asset_id;
  if (req.params.asset_id && ObjectId.isValid(req.params.asset_id)) {
    asset = await db
      .collection("sys_asset")
      .findOneAndUpdate(
        { asset_id: new ObjectId(req.params.asset_id) },
        {$set:{
          _updated_by: new ObjectId(req.user._id),
          _updated_on: new Date(),
          mimetype: file.mimetype,
        }
        }
      );

      if(asset){
      await fileUtil.delete(`${req.params.base}${req.params.asset_id}`);
      }
  } else {
    new_asset_id = new ObjectId();
    await db.createCollection("sys_asset");
    asset = await db.collection("sys_asset").insertOne({
      _title: file.originalname,
      name: file.originalname,
      _created_by: new ObjectId(req.user._id),
      _created: new Date(),
      mimetype: file.mimetype,
      asset_id: new_asset_id,
    },{ returnDocument: 'after' });
  }

  if (asset && (new_asset_id || req.params.asset_id)) {
    await fileUtil.upload(
      `${req.params.base}${new_asset_id || req.params.asset_id}`,
      file
    );
    res.status(200).send({ sys_asset: (asset.insertedId || asset._id) });
  }
};

const deleteAsset = async (req, res, next) => {
  if (!req.params || !req.params.base) {
    res.status(503).send();
    return;
  }

  console.log(req.params.id);
  const db = await DBConnection.getDB(req.params.base);
  const asset = await db
    .collection("sys_asset")
    .findOne({ _id: new ObjectId(req.params.id) });
  const fileUtil = new FileUtil();
  await fileUtil.delete(`${req.params.base}${asset.asset_id}`);

  await db.collection("sys_asset").deleteOne({ _id: new ObjectId(asset._id) });
  console.log("deleted asset");
  res.status(200).send();
};

module.exports = {
  getAssets,
  uploadAsset,
  deleteAsset,
};
