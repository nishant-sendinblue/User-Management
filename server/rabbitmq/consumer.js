const amqp = require("amqplib");
const nodemailer = require('nodemailer');
require("dotenv").config();

const SendMail = (email) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    let mailOptions = {
        from: 'nishant007tech@gmail.com',
        to: email,
        subject: 'Welcome to User Management System!',
        text: `Welcome ${email} , Best of Luck!`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const consumer = async (queueName, email) => {
    try {
        const conn = await amqp.connect(process.env.RMQ_URL);
        const channel = await conn.createChannel();
        channel.assertQueue(queueName, {
            durable: false
        });
        channel.consume(queueName, (msg) => {
            console.log(`Message Subscribed: ${msg.content.toString()}`);
            SendMail(email);
            channel.ack(msg);
        })
    } catch (error) {
        throw Error(error)
    }
}
module.exports = consumer