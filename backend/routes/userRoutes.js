const { registerUser, loginUser, getProfile } = require("../controller/userController");
const auth = require("../middleware/auth");

const router = require("express").Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", auth, getProfile);

module.exports = router;
 