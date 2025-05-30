const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./database");
const http = require("http");
const path = require("path");
const app = express();
const PORT = 8080;

// initialize DataBase
initializeDatabase();
app.use(bodyParser.json());

// CORS allow list
const allowedOrigins = [
  "http://localhost:3000",
  "https://claim.mediasolution.ai",
  "https://amnhacso.com",
  "https://amnhacso.org",
  "https://amnhacso.uk",
  "https://ansnetwork.org",
  "https://ansnetwork.uk",
  "https://anscms.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

const server = http.createServer(app);

// Import routes
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mailRoutes = require("./routes/mailRoutes");

// Use routes
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);
app.use("/admin", adminRoutes);
app.use("/mail", mailRoutes);

// Static file access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
