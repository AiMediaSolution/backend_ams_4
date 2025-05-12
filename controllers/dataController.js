const { addData, getAllData, getDataShow } = require("../models/dataModel");

function addDataHandler(req, res) {
  const { type, id_socialMedia, caption, date, date_update } = req.body;
  const account_Id = req.user.account_Id;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  addData(
    account_Id,
    type,
    id_socialMedia,
    caption,
    date,
    date_update,
    image_url,
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Data added successfully" });
    }
  );
}
function getAllDataHandler(req, res) {
  getDataShow((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const dataWithLinks = rows.map((item) => {
      let link_share = "";
      switch (item.type) {
        case "facebook":
          link_share = `https://www.facebook.com/share/v/${item.id_socialMedia}/`;
          break;
        case "tiktok":
          link_share = `https://www.tiktok.com/video/${item.id_socialMedia}`;
          break;
        case "youtube":
          link_share = `https://www.youtube.com/watch?v=${item.id_socialMedia}`;
          break;
        default:
          link_share = "";
      }
      return {
        ...item,
        link_share,
      };
    });

    res.status(200).json(dataWithLinks);
  });
}
function getTestMessageUrl(req, res) {
  console.log("Test message");
  console.log(process.env.UPLOAD_PATH);
  res.status(200).json({
    message: "Test message",
  });
}
module.exports = { addDataHandler, getAllDataHandler, getTestMessageUrl };
