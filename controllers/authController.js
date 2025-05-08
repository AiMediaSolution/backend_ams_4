require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  getUserByUsername,
  createUser,
  saveRefreshToken,
  getRefreshTokenByUserId,
} = require("../models/accountModel");

async function login(req, res) {
  const { username, password } = req.body;
  getUserByUsername(username, async (err, user) => {
    if (err) return res.status(500).json({ error: "Server error" });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isDeleted) {
      return res.status(403).json({ error: "Account has been deleted" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passWord);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { account_Id: user.account_Id, account_type: user.account_type },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { account_Id: user.account_Id, account_type: user.account_type },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    saveRefreshToken(user.account_Id, refreshToken, (err) => {
      if (err) return res.status(500).json({ error: "Failed to save token" });
      res.json({ accessToken, refreshToken });
    });
  });
}

function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    getRefreshTokenByUserId(user.account_Id, (err, storedToken) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(403).json({ error: "Refresh token mismatch" });
      }
      const newAccessToken = jwt.sign(
        { account_Id: user.account_Id, account_type: user.account_type },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );
      res.json({ accessToken: newAccessToken });
    });
  });
}
function getUserInformation(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    account_Id: user.account_Id,
    account_type: user.account_type,
    username: user.username,
  });
}

module.exports = { login, refreshToken, getUserInformation };
