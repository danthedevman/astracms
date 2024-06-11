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
    const answer = await db.collection(collection).find(query);
    if(options && options.sort_by){
      let sortObj = {};
      sortObj[options.sort_by] = options.sort_by_direction === "asc" ? 1 : -1;
      answer.sort(sortObj);
    }

    return answer.toArray();
  }

  async get(collection, query) {
    const db = await DBConnection.getDB(this.DB);
    const mainDB = await DBConnection.getDB(process.env.MAIN_DB);
    const record = await db.collection(collection).findOne(query);
    if (record && 
      ObjectId.isValid(record._created_by) &&
      ObjectId.isValid(record._updated_by)
    ) {
      let created_by = await mainDB.collection("sys_user").findOne(
        {
          _id: new ObjectId(record._created_by),
        }
      );

      record._created_by = created_by.name;

      let updated_by = await mainDB.collection("sys_user").findOne(
        {
          _id: new ObjectId(record._updated_by),
        }
      );

      const fields = await this.query("sys_field", {
        _model: new ObjectId(this.REQUEST.params.model),
      });

      for (const field of fields) {

        if (field.type === "reference") {
          if (!record[field.name] || !ObjectId.isValid(record[field.name]))
            continue;
          let refVal = await this.get("sys_content", {
            _id: new ObjectId(record[field.name]),
          });
          if (!refVal) continue;
          record[field.name] = {
            value: refVal._id.toString(),
            display_value: refVal._title,
          };

          if(field.title_field === "yes"){
            record._title = record[field.name].display_value;
          }
        }
  
        if (field.type === "asset") {
          field.reference_model = "sys_asset";
          if (!record[field.name] || !ObjectId.isValid(record[field.name]))
            continue;
          let refVal = await this.get("sys_asset", {
            _id: new ObjectId(record[field.name]),
          });
          if (!refVal) continue;
          record[field.name] = {
            value: refVal._id.toString(),
            display_value: refVal._title,
          };
          if(field.title_field === "yes"){
            record._title = record[field.name].display_value;
          }
        }
      }

      record._fields = fields;
      record._updated_by = updated_by.name;
    }

    return record;
  }

  delete(collection, query) {}
}

module.exports = DBHelper;
