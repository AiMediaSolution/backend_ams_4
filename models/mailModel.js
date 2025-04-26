const { db } = require("../database");

async function addMailContact(name, email, message, callback) {
  db.run(
    `INSERT INTO mail (name, email, message) VALUES(?, ?, ?)`,
    [name, email, message],
    callback
  );
}

module.exports = {
  addMailContact,
};
