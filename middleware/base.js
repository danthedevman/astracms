const { locals } = require("../app");
const DBConnection = require("../database/DBConnection");
const ObjectId = require("mongodb").ObjectId;
const canAccessBase = async (req, res, next) => {
  const baseId = req.params.base;
  if (!ObjectId.isValid(baseId)) {
    res.redirect("/");
    return;
  }

  const mainDB = await DBConnection.getDB(process.env.MAIN_DB);
  const base = await mainDB
    .collection("sys_base")
    .findOne({ user: req.user._id, _id: new ObjectId(baseId) });
  if (!base) {
    res.redirect("/");
    return;
  }

  res.locals.base = base._id.toString();

  if(base && (!req.path || req.path === "/")){
    res.redirect(`/${base._id}/dashboard`);
    return;
  }

  return next();
};

module.exports = { canAccessBase };
