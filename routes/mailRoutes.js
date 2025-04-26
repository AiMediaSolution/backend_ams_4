const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { sendMailContactHandler } = require("../controllers/emailController");
const router = express.Router();

// Router add data
router.post("/", sendMailContactHandler);

module.exports = router;
