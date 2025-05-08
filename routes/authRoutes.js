const express = require("express");
const {
  login,
  refreshToken,
  getUserInformation,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to process login request
router.post("/login", login);
// Route to process refresh Token
router.post("/token", refreshToken);
// Route to get refresh Token
router.post("/refresh-token", refreshToken);

router.get("/user", authenticateToken, getUserInformation);

module.exports = router;
