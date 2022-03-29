const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/UserController");
//api to create new user
router.post("/create_user", UserController.createUser);
//login api for admin
router.post("/login", AuthController.Login);
//api to get user by id
router.get("/user_by_id/:id", auth, UserController.getUserById)
//api to get users according to pagination or page limit
router.get("/users", auth, UserController.paginatedResults);
//update user by Id api
router.patch("/edit_user/:id", auth, UserController.updateUserById);
//delete user by Id api
router.delete('/delete_user/:id', auth, UserController.deleteUserById);
//filter users by date range (when user is created)
router.get("/users_by_date_range", auth, UserController.filterUserByDate)

module.exports = router;