const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/UserController");
//api to create new user
router.post("/create_user", UserController.createUser);
//login api for admin
router.post("/login", AuthController.Login);
//filter users by date range (when user is created)
router.get("/users/search", auth, UserController.searchUsers)
//api to get user by id
router.get("/users/:id", auth, UserController.getUserById)
//api to get users according to pagination or page limit
router.get("/users", auth, UserController.getUsers);
//update user by Id api
router.patch("/users/:id", auth, UserController.updateUserById);
//delete user by Id api
router.delete('/users/:id', auth, UserController.deleteUserById);


module.exports = router;