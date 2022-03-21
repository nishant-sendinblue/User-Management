const router = require("express").Router();
const bcrypt = require("bcrypt")
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("./auth_middleware");


router.post("/create_user", async (req, res) => {
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
        res.json(savedUser);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.post("/login", async (req, res) => {
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
});
router.get("/get_user", auth, async (req, res) => {
    let user = await userModel.findOne({ _id: req.user }, { name: 1, email: 1 })
    res.status(200).send(user);
})

router.get("/users", auth, paginatedResults(), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults() {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        try {
            let allUsers = await userModel.find({}, { password: 0 })
            let results = await userModel.find({}, { password: 0 })
                .sort({ _id: 1 })
                .limit(limit)
                .lean()
                .skip(skipIndex)
                .exec();
            res.paginatedResults = { results: results, allUsers: allUsers };
            next();
        } catch (e) {
            res.status(500).json({ message: "Error Occured" });
        }
    };
}

router.get("/view_user/:id", auth, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.id }, { password: 0 });
        res.json(user);
    } catch (error) {
        res.status(400).send(error)
    }
})
router.patch("/edit_user/:id", auth, async (req, res) => {
    try {
        let updatedUser = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/delete_user/:id', auth, async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.params.id });
        const Users = await userModel.find({}, { password: 0 });
        res.json(Users);
    } catch (error) {
        res.status(400).send(error)
    }
});

router.get("/get_users_by_date_range", auth, async (req, res) => {
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
})

module.exports = router;