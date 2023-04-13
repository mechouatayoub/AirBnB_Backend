const mongoose = require("mongoose");
const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_USER}?replicaSet=${process.env.MONGO_REPLICAT_SET}`;

const connection = mongoose.createConnection(connectionString);

console.log(`connection string:${connectionString}`);

module.exports = connection;
