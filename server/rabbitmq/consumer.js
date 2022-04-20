const amqp = require("amqplib");
const request = require('request');
require("dotenv").config();

const SendMail = (email) => {
    console.log("Email sent to", email);
    const options = {
        method: 'POST',
        url: 'https://in-automate.sendinblue.com/api/v2/identify',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ma-key': process.env.MA_KEY
        },
        body: { email: email, attributes: { webapp: 'user management' } },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });
}
const consumer = async () => {
    try {
        const conn = await amqp.connect(process.env.RMQ_URL);
        const channel = await conn.createChannel();
        let queueName = "send_mail";
        channel.assertQueue(queueName, {
            durable: false
        });
        channel.consume(queueName, (msg) => {
            let data = JSON.parse(msg.content.toString())
            console.log(`Message Subscribed:`, data["msg"]);
            SendMail(data["email"]);
            channel.ack(msg);
        })
    } catch (error) {
        throw Error(error)
    }
}
module.exports = consumer