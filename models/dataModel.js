const { db } = require("../database");

function addData(
  account_Id,
  type,
  id_socialMedia,
  caption,
  date,
  date_update,
  image_url,
  callback
) {
  db.run(
    `INSERT INTO data (account_Id, type, id_socialMedia, caption, date, date_update , image_url, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      account_Id,
      type,
      id_socialMedia,
      caption,
      date,
      date_update,
      image_url,
      0,
    ],
    callback
  );
}

function getDataByAccountId(accountId, callback) {
  db.all(`SELECT * FROM data WHERE account_Id = ?`, [accountId], callback);
}

function getAllData(callback) {
  db.all(`SELECT * FROM data;`, [], callback);
}
function getDataShow(callback) {
  db.all(
    `SELECT * FROM data WHERE data.is_deleted == 0  ORDER BY data.date DESC LIMIT 18`,
    [],
    callback
  );
}

module.exports = {
  addData,
  getDataByAccountId,
  getAllData,
  getDataShow,
};
