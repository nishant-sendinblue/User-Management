const amqp = require("amqplib");
const ConsumeMsg = require("./consumer");
require("dotenv").config();

const producer = async (email) => {
    try {
        const conn = await amqp.connect(process.env.RMQ_URL);
        const channel = await conn.createChannel();
        let queueName = "send_mail"
        let message = {
            msg: "Send Welcome mail to New User!",
            email: email
        }
        channel.assertQueue(queueName, {
            durable: false
        });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log(`Message Published: ${message.msg}`);
        ConsumeMsg();
        setTimeout(() => {
            conn.close();
        }, 1000);
    } catch (error) {
        throw Error(error)
    }
}
module.exports = producer