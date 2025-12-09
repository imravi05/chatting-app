const router = require("express").Router();
const { login, register, getAllUsers } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:id", getAllUsers); // :id is the current user (to exclude them from list)

module.exports = router;