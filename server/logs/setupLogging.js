const colors = require("colors")
const fs = require("fs")
const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const LogMiddleware = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date = current_datetime.toLocaleString();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let Coloredlog = `[${colors.blue(formatted_date)}] ${colors.green(method)}:${colors.cyan(url)} ${status} ${colors.red(durationInMilliseconds.toLocaleString())} ms`;
    console.log(Coloredlog);
    let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    fs.appendFile("logs/request_logs.txt", log + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
    next();
}
module.exports = LogMiddleware