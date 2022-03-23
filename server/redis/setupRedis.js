const { createClient } = require("redis");
require("dotenv").config();

const client = createClient(process.env.REDIS_PORT);
client.connect();

module.exports = client;