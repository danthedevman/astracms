const { ObjectId } = require("mongodb");
const DBConnection = require("../database/DBConnection");
const getSearch = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const query = req.query;
  let modelId = req.params.model;
  if(ObjectId.isValid(modelId)){
    modelId = "sys_content";
  }
  const searchCollection = await db.collection(`${modelId}`);
  //searchCollection.dropIndexes();
  await searchCollection.createIndex({ _title: "text" });

  let queryObj = {
    _title: {
      $regex: `^${decodeURI(String(query.sys_text_search))}`,
      $options: "i",
    },
  };

  if(modelId === "sys_content"){
    queryObj._model = new ObjectId(req.params.model);
  }

  let agg = await searchCollection.aggregate([
    { $match: queryObj },
  ]);

  let arr = await agg.toArray();

  console.log(arr);
  res.status(200).send({ results: arr });
};

module.exports = {
  getSearch,
};
