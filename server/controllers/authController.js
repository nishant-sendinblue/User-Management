const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Login = async (req, res) => {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: 'Email or Password is Wrong' });
    }
    if ((user?.role == "admin" || user?.role == "superAdmin") && user?.status == "active") {
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid Password or Email' });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT);
        res.json({ token: token, user: { _id: user._id, name: user.name, email: user.email }, message: "Login Successful" });
    } else {
        res.status(404).json({ message: "Not Authorized!" })
    }
}

module.exports = {
    Login,
};