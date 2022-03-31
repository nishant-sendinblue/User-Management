const amqp = require("amqplib");
const ConsumeMsg = require("./consumer");
require("dotenv").config();

const producer = async (email) => {
    try {
        const conn = await amqp.connect(process.env.RMQ_URL);
        conn.on('error', function (handle) {
            reject(handle);
        })
        const channel = await conn.createChannel();
        let queueName = "send_mail";
        let message = "Send Welcome mail to New User!"
        channel.assertQueue(queueName, {
            durable: false
        });
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message Published: ${message}`);
        ConsumeMsg(queueName, email);
        setTimeout(() => {
            conn.close();
        }, 1000);

    } catch (error) {
        throw Error(error)
    }
}
module.exports = producer