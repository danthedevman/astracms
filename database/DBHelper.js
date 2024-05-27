const ObjectId = require("mongodb").ObjectId;
const DBConnection = require("./DBConnection");

class DBHelper {
  constructor(options) {
    this.DB = options.db;
    this.REQUEST = options.request;
    this.CURRENT_USER =
      this.REQUEST && this.REQUEST.user ? this.REQUEST.user._id : "";
  }

  async save(collection, query, data) {
    if (!collection || !data) {
      return;
    }

    const db = await DBConnection.getDB(this.DB);
    let answer;
    let record;
    data._updated_by = this.CURRENT_USER;
    data._updated_on = new Date();
    collection = await db.collection(collection);
    if (query) {
      record = await collection.findOneAndUpdate(query, { $set: data });
    } else {
      data._created_by = this.CURRENT_USER;
      data._created_on = new Date();
      record = await collection.insertOne(data);
    }
    answer = record && (record._id || record.insertedId);
    return answer;
  }

  async query(collection, query, options) {
    const db = await DBConnection.getDB(this.DB);
    const answer = await db.collection(collection).find(query).toArray();

    return answer;
  }

  async get(collection, query) {
    const db = await DBConnection.getDB(this.DB);
    const answer = await db.collection(collection).findOne(query);
    if (
      ObjectId.isValid(answer._created_by) &&
      ObjectId.isValid(answer._updated_by)
    ) {
      let created_by = await new DBHelper({ db: process.env.MAIN_DB }).get(
        "sys_user",
        {
          _id: new ObjectId(answer._created_by),
        }
      );

      answer._created_by = created_by.name;

      let updated_by = await new DBHelper({ db: process.env.MAIN_DB }).get(
        "sys_user",
        {
          _id: new ObjectId(answer._updated_by),
        }
      );

      answer._updated_by = updated_by.name;
    }

    return answer;
  }

  delete(collection, query) {}
}

module.exports = DBHelper;
