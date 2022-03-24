const userModel = require("../models/userModel");
const client = require("../redis/setupRedis");

const getUserFromToken = async (req, res) => {
    try {
        let key = req.user
        let dataFromRedis = await client.get(key);
        if (dataFromRedis) {
            return res.json(JSON.parse(dataFromRedis));
        } else {
            let user = await userModel.findOne({ _id: req.user }, { password: 0 })
            client.setEx(key, 3600, JSON.stringify(user));
            res.status(200).send(user);
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message });
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
        const Users = await userModel.find({}, { password: 0 });
        res.json(Users);
    } catch (error) {
        res.status(400).send(error)
    }
}
const filterUserByDate = async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        let key = new Date(startDate).toDateString() + "-" + new Date(endDate).toDateString();
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
module.exports = {
    getUserFromToken,
    getUserById,
    updateUserById,
    deleteUserById,
    filterUserByDate
}