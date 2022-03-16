const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes")
require("dotenv").config();


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true},()=>{
    console.log('We Are Connected to DB');
});

//middlewares
app.use(cors());
app.use(express.json());
app.use('/', routes);


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server start at port ${port}`)
})