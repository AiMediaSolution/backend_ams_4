const { db } = require("../database");

function addData(
  account_Id,
  type,
  id_socialMedia,
  caption,
  video_url,
  date,
  date_update,
  image_url,
  callback
) {
  db.run(
    `INSERT INTO data (account_Id, type, content, video_url, caption, date ,share_url, image_url, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      account_Id,
      type,
      id_socialMedia,
      caption,
      video_url,
      date,
      date_update,
      image_url,
      0,
    ],
    callback
  );
}
function addMultiData(dataArray, callback) {
  const placeholders = dataArray.map(() => "(?, ?, ?, ?)").join(", ");
  const values = dataArray.flatMap(({ accountId, content, status, date }) => [
    accountId,
    content,
    status,
    date,
  ]);

  const query = `
    INSERT INTO data (account_Id, content, status, date)
    VALUES ${placeholders}
  `;

  db.run("BEGIN TRANSACTION", (err) => {
    if (err) return callback(err);

    db.run(query, values, (insertErr) => {
      if (insertErr) {
        db.run("ROLLBACK", () => callback(insertErr));
      } else {
        db.run("COMMIT", callback);
      }
    });
  });
}

function getDataByAccountId(accountId, callback) {
  db.all(`SELECT * FROM data WHERE account_Id = ?`, [accountId], callback);
}

function getAllData(callback) {
  db.all(
    `SELECT d.*, a.userName
    FROM data d JOIN account a
    ON d.account_Id = a.account_Id;`,
    [],
    callback
  );
}
function getAllDataProcessing(callback) {
  db.all(`SELECT * FROM data WHERE = "processing"`, [], callback);
}
function getAllAccountAdmin(callback) {
  db.all(`SELECT * FROM account WHERE account_type = 'admin'`, [], callback);
}
function updateStatus(newStatus, date, data_Id, callback) {
  db.run(
    `UPDATE data SET status = ? , "date" = ?  WHERE data_Id = ?`,
    [newStatus, date, data_Id],
    callback
  );
}
function getAllDataPending(callback) {
  db.all(
    `SELECT data.*, account.userName FROM data JOIN account ON data.account_Id = account.account_Id WHERE data.status = 'pending'`,
    [],
    callback
  );
}

function getCountOfDataPending(callback) {
  const sql = `SELECT COUNT(*) AS total FROM data WHERE status != ? AND status != ? ORDER BY date ASC;`;
  db.get(sql, ["done", "doing"], (err, row) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, row ? row.total : 0);
  });
}
// Get data with threads to bas for run
function getListDataSendToBas(threads, callback) {
  db.all(
    `SELECT data.*, account.userName FROM data JOIN account ON data.account_Id = account.account_Id WHERE data.status != 'done' AND data.status != 'doing' ORDER BY date ASC LIMIT ?`,
    [threads],
    callback
  );
}
// Upload status and date in list data_ id
function upLoadStatusPendingBas(list_id, newStatus, date, callback) {
  console.log(list_id, newStatus, date);
  if (!list_id.length) return callback(null, []);
  const placeholders = list_id.map(() => "?").join(", ");
  const sql = `UPDATE data SET status = ? , "date" = ? WHERE data_Id IN (${placeholders})`;
  db.run(sql, [newStatus, date, ...list_id], function (err) {
    if (err) return callback(err, null);
    callback(null, this.changes);
  });
}

module.exports = {
  addData,
  getDataByAccountId,
  getAllData,
  getAllAccountAdmin,
  updateStatus,
  getAllDataProcessing,
  addMultiData,
  getAllDataPending,
  getCountOfDataPending,
  getListDataSendToBas,
  upLoadStatusPendingBas,
};
