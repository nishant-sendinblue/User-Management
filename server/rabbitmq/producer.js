const amqp = require("amqplib");
const ConsumeMsg = require("./consumer");
require("dotenv").config();

const producer = async (email) => {
    let conn=null;
    try {
        conn= await amqp.connect(process.env.RMQ_URL);
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
    } catch (error) {
        throw Error(error);
    }finally{
        setTimeout(() => {
            conn.close();
        }, 3000);
    }
       
}
module.exports = producer