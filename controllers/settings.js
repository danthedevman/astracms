const DBConnection = require("../database/DBConnection");
const ObjectId = require("mongodb").ObjectId;

const getGeneralSettings = (req, res, next) => {
  res.render("./pages/settings/general", {
    title: "General Settings",
    layout: "./layouts/base",
    path: "settings",
    subpath:"general"
  });
};

const getDeveloperSettings = (req, res, next) => {
  res.render("./pages/settings/developer", {
    title: "Developer Settings",
    layout: "./layouts/base",
    path: "settings",
    subpath:"developer"
  });
};

const saveBaseDetails = async (req, res, next) => {
  const { base_name, base_description } = req.body;
  const mainDB = await DBConnection.getDB(process.env.MAIN_DB);
  const base = await mainDB
    .collection("sys_base")
    .updateOne(
      { _id: new ObjectId(res.locals.base._id) },
      { $set: { name: base_name, description: base_description } }
    );
  if (base) {
    res.status(200).send();
  }
};

const deleteBase = async (req, res, next) => {
  const mainDB = await DBConnection.getDB(process.env.MAIN_DB);
  const base = await mainDB
    .collection("sys_base")
    .findOneAndDelete({ _id: new ObjectId(res.locals.base._id) });
  res.status(200).send();
};

module.exports = {
  getGeneralSettings,
  getDeveloperSettings,
  saveBaseDetails,
  deleteBase,
};
