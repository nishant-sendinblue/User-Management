const userModel = require("../models/userModel");

const getUserFromToken = async (req, res) => {
    let user = await userModel.findOne({ _id: req.user }, { name: 1, email: 1 })
    res.status(200).send(user);
}
const getUserById = async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.id }, { password: 0 })
    res.status(200).send(user);
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
        let results = await userModel.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).lean()
        res.json(results);
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