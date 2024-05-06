const MongoClient = require("mongodb").MongoClient;

const connections = {};

module.exports = {
  connect: async (database, callback) => {
    const client = new MongoClient(process.env.DATABASE_URL);
    let connection = await client.connect();
    let db = connection.db(database);
    if(!db){
        console.log("No database found.");
        if (callback && typeof callback == "function") {
            callback();
        }
        return;
    }
    connections[String(database).toLowerCase()] = db;
    if (callback && typeof callback == "function") {
      callback();
    }
  },

  getDB:async function (database) {
    if (!connections[database]) {
        console.log(`Reconnecting to database ${database}`);
      return await this.connect(database);
    }
    console.log(`Found connection to database ${database}`);
    return connections[database];
  },
};
