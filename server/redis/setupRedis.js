const { createClient } = require("redis");
require("dotenv").config();
let client = null;
(async () => {
    // { url: process.env.REDIS_URL }
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
})();

module.exports = client;