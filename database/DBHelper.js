const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("./DBConnection");

class DBHelper {
  constructor(options) {
    this.DB = options.db;
  }

  async save(collection, query, data) {
    if (!collection || !data) {
      return;
    }

    const db = await DBConnection.getDB(this.DB);
    let answer;
    let record;
    collection = await db.collection(collection);
    if (query) {
      record = await collection.findOneAndUpdate(query, { $set: data });
    } else record = await collection.insertOne(data);
    answer = record && (record._id || record.insertedId);
    return answer;
  }

  update(collection, query, data) {}

  async query(collection, query, options) {
    const db = await DBConnection.getDB(this.DB);
    const answer = await db.collection(collection).find(query).toArray();

    return answer;
  }

  get(collection, query) {}

  delete(collection, query) {}
}

module.exports = DBHelper;
