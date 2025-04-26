const { addData } = require("../models/dataModel");

function addDataHandler(req, res) {
  const { type, id_socialMedia, caption, video_url, date, date_update } =
    req.body;
  const account_Id = req.user.account_Id;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  addData(
    account_Id,
    type,
    id_socialMedia,
    caption,
    video_url,
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

module.exports = { addDataHandler };
