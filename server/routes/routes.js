const router = require("express").Router();
const userModel = require("../models/userModel");
const auth = require("../middleware/auth_middleware");
const AuthController = require("../controllers/authController");
const GetUserController = require("../controllers/getUserController");

//api to create new user
router.post("/create_user", AuthController.createUser);
//login api for admin
router.post("/login", AuthController.Login);
//api to get user from token and auth Middleware (to know which user is currently logged in)
router.get("/get_user", auth, GetUserController.getUserFromToken)
//api to get user by id
router.get("/get_user_by_id/:id", auth, GetUserController.getUserById)

//api to get users according to pagination or page limit
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
//update user by Id api
router.patch("/edit_user/:id", auth, GetUserController.updateUserById);
//delete user by Id api
router.delete('/delete_user/:id', auth, GetUserController.deleteUserById);
//filter users by date range (when user is created)
router.get("/get_users_by_date_range", auth, GetUserController.filterUserByDate)

module.exports = router;