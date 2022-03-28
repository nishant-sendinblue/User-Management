const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ProduceMsg = require("../rabbitmq/producer");

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
        res.json(savedUser);
    } catch (err) {
        res.status(400).json(err);
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: 'Email or Password is Wrong' });
    }
    if (user?.role == "admin") {
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid Password or Email' });
        }
        const token = jwt.sign({ id: user._id }, 'NishantSecretKey');
        res.json({ token: token, user: { name: user.name, email: user.email }, message: "Login Successful" });
    } else {
        res.status(404).json({ message: "Not Authorized!" })
    }
}


module.exports = {
    createUser,
    Login,
};