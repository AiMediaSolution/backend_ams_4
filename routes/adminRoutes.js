const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { readAllAccountsHandler } = require("../controllers/adminController");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { addDataHandler } = require("../controllers/dataController");
const upload = require("../middlewares/upload");
const router = express.Router();

// Admin routes

// Create new account
router.post(
  "/upload",
  authenticateToken,
  authorize(["admin"]),
  upload.single("image"),
  addDataHandler
);
// Get all account
router.get(
  "/",
  authenticateToken,
  authorize(["admin", "manager"]),
  readAllAccountsHandler
);
// Read account by id
// router.get(
//   "/:accountId",
//   authenticateToken,
//   authorize(["admin", "manager"]),
//   readAccountByIdHandler
// );
// // Edit account
// router.put(
//   "/:accountId",
//   authenticateToken,
//   authorize(["admin", "manager"]),
//   updateAccountHandler
// );
// // Delete account
// router.delete(
//   "/:accountId",
//   authenticateToken,
//   authorize(["admin", "manager"]),
//   deleteAccountHandler
// );
// router.put(
//   "/restore/:accountId",
//   authenticateToken,
//   authorize(["admin", "manager"]),
//   restoreAccountHandler
// );

module.exports = router;
