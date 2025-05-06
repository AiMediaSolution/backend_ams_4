const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  addDataHandler,
  getAllDataHandler,
} = require("../controllers/dataController");
const upload = require("../middlewares/upload");
const router = express.Router();

// Router add data
// router.post("/", addDataHandler);

// router.post("/", upload.single("image"), addDataHandler);
// // Router add list data
// router.post("/list", authenticateToken, addMultiDataHandler);

// Router get all data by user
router.get("/", getAllDataHandler);

// router.patch("/", updateListStatusInBas);

// router.get("/count", getCountOfDataPendingHandler);
module.exports = router;
