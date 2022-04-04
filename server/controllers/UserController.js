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
        let user = await userModel.findOne({ _id: req.params.id }, { password: 0 })
        res.status(200).send(user);
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


const fetchQueryResults = async (query) => {
    if (query.startDate && query.endDate) {
        return await userModel.find({
            createdAt: {
                $gte: query.startDate,
                $lte: new Date(query.endDate).toDateString() + " " + "24:00:00"
            }
        })
            .sort({ _id: 1 })
            .limit(query.limit)
            .lean()
            .skip(query.skipIndex)
            .exec();
    }
    if (query.name) {
        return await userModel.find({ name: { $regex: query.name, $options: "$i" } })
            .sort({ _id: 1 })
            .limit(query.limit)
            .lean()
            .skip(query.skipIndex)
            .exec();
    }
    if (query.getUsers) {
        return await userModel.find({}, { password: 0 })
            .sort({ _id: 1 })
            .limit(query.limit)
            .lean()
            .skip(query.skipIndex)
            .exec();
    }
}

const searchUsers = async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const name = req.query.name;
        //added limit and skipIndex in query obj. because they are common in all cases
        let query = {};
        query.limit = limit;
        query.skipIndex = skipIndex;
        if (startDate && endDate) {
            query.startDate = startDate;
            query.endDate = endDate;
            let key = `User-${page} ` + new Date(startDate).toDateString() + "-" + new Date(endDate).toDateString();
            let dataFromRedis = await client.get(key);
            if (dataFromRedis) {
                return res.json(JSON.parse(dataFromRedis));
            } else {
                let count = await userModel.find({
                    createdAt: {
                        $gte: startDate,
                        $lte: new Date(endDate).toDateString() + " " + "24:00:00"
                    }
                }).countDocuments();
                let results = await fetchQueryResults(query);
                client.setEx(key, 3600, JSON.stringify({ results: results, count: count }));
                res.json({ results: results, count: count });
            }
        }
        if (name) {
            try {
                query.name = name;
                let count = await userModel.find({ name: { $regex: name, $options: "$i" } }).countDocuments();
                let results = await fetchQueryResults(query);
                res.status(200).json({ results: results, count: count });
            } catch (e) {
                res.status(500).json({ message: "Error Occured" });
            }
        }

    } catch (error) {
        res.status(400).send(error);
    }
}

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        let query = {};
        query.limit = limit;
        query.skipIndex = skipIndex;
        query.getUsers = "getUsers";
        let count = await userModel.find({}, { password: 0 }).countDocuments();
        let results = await fetchQueryResults(query);
        res.status(200).json({ results: results, count: count });
    } catch (e) {
        res.status(500).json({ message: "Error Occured" });
    }
};
module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    searchUsers,
    createUser,
    getUsers
}