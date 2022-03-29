const userModel = require("../models/userModel");
const client = require("../redis/setupRedis");
const ProduceMsg = require("../rabbitmq/producer");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    let emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(409).json({ message: 'Email is already exist...!' });
    }
    if (!req.body.password) {
        return res.status(400).json({ message: 'Password is required!' });
    }
    //bcrypt the password basically into hash format for security reasons
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hassedPassword,
        role: req.body.role,
    });
    try {
        const savedUser = await user.save();
        ProduceMsg(savedUser?.email);
        res.json({ savedUser: savedUser, msg: "Data Received" });
    } catch (err) {
        res.status(400).json(err);
    }
}

const getUserById = async (req, res) => {
    try {
        let key = req.params.id;
        let dataFromRedis = await client.get(key);
        if (dataFromRedis) {
            return res.json(JSON.parse(dataFromRedis));
        } else {
            let user = await userModel.findOne({ _id: req.params.id }, { password: 0 })
            client.setEx(key, 3600, JSON.stringify(user));
            res.status(200).send(user);
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}
const updateUserById = async (req, res) => {
    try {
        let updatedUser = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).send(error)
    }
}
const deleteUserById = async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "User Deleted!" });
    } catch (error) {
        res.status(400).send(error)
    }
}
const filterUserByDate = async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        let key = "User-" + new Date(startDate).toDateString() + "-" + new Date(endDate).toDateString();
        let dataFromRedis = await client.get(key);
        if (dataFromRedis) {
            return res.json(JSON.parse(dataFromRedis));
        } else {
            let results = await userModel.find({
                createdAt: {
                    $gte: startDate,
                    $lte: new Date(endDate).toDateString() + " " + "24:00:00"
                }
            }).lean()
            client.setEx(key, 3600, JSON.stringify(results));
            res.json(results);
        }
    } catch (error) {
        res.status(400).send(error)
    }
}
const paginatedResults = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        let allUsers = await userModel.find({}, { password: 0 })
        let results = await userModel.find({}, { password: 0 })
            .sort({ _id: 1 })
            .limit(limit)
            .lean()
            .skip(skipIndex)
            .exec();
        res.status(200).json({ results: results, allUsers: allUsers });
    } catch (e) {
        res.status(500).json({ message: "Error Occured" });
    }
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    filterUserByDate,
    createUser,
    paginatedResults
}