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
        let existingUser = await userModel.findOne({ email:  req.body.email});
        if (existingUser?._id == req.params.id || !existingUser) {
            let updatedUser = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
             res.json(updatedUser);
        } else {
             res.status(409).json({ message: "Email already exist!" })
        }
    } catch (error) {
        res.status(400).send({message:"Something went wrong!"})
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
const fetchQueryResults = async (query, limit, skipIndex) => {
    return await userModel.find(query, { password: 0 })
        .sort({ _id: 1 })
        .skip(skipIndex)
        .limit(limit)
        .lean()
        .exec();
}

const searchUsers = async (req, res) => {
    try {
        const {
            startDate = null,
            endDate = null,
            name = null,
            page = 1,
            limit = 6
        } = req.query;
        const skipIndex = (page - 1) * limit;
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: startDate,
                $lte: new Date(endDate).toDateString() + " " + "24:00:00"
            }
        } if (name) {
            query.name = { $regex: name, $options: "$i" };
        }
        let key = `User-${page}-` + JSON.stringify(query);
        let dataFromRedis = await client.get(key);
        if (dataFromRedis) {
            return res.json(JSON.parse(dataFromRedis));
        } else {
            let count = await userModel.find(query).countDocuments();
            let results = await fetchQueryResults(query, limit, skipIndex);
            client.setEx(key, 3600, JSON.stringify({ results: results, count: count }));
            res.json({ results: results, count: count });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const skipIndex = (page - 1) * limit;
        let query = {};
        let count = await userModel.find({}, { password: 0 }).countDocuments();
        let results = await fetchQueryResults(query, limit, skipIndex);
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