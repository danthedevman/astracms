const { ObjectId } = require("mongodb");
const DBConnection = require("../database/DBConnection");
const getSearch = async (req, res, next) => {
  const db = await DBConnection.getDB(req.params.base);
  const query = req.query;
  let modelId = req.params.model;
  if (ObjectId.isValid(modelId)) {
    modelId = "sys_content";
  }
  const searchCollection = await db.collection(`${modelId}`);
  //searchCollection.dropIndexes();
  await searchCollection.createIndex({ _title: "text" });

  let queryObj;
  if (query.sys_text_search) {
    console.log("text search found")
    queryObj = {
      _title: {
        $regex: `^${decodeURI(String(query.sys_text_search))}`,
        $options: "i",
      },
    };

    if (modelId === "sys_content") {
      queryObj._model = new ObjectId(req.params.model);
    }
  }

  let results;
  let limit = 10;
  if (queryObj) {
    results = await searchCollection.aggregate([
      { $match: queryObj},{$limit: limit },
    ]);
  } else {
    results = await searchCollection.find({}).limit(limit);
  }

  results = await results.toArray();

  res.status(200).send({ results: results });
};

module.exports = {
  getSearch,
};
