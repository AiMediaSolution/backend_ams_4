const {
  createAccount,
  readAllAccounts,
  readAccountById,
  updateAccount,
  deleteAccount,
  readCustomerAccounts,
  restoreAccount,
} = require("../models/adminModel");
// const { createCustomerAccount } = require("../models/accountModel");
function createAccountHandler(req, res) {
  const { type, content, video_url, caption, date, share_url } = req.body;
  // Check input data
  if (!accountType || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  createAccount(accountType, username, password, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Account created successfully" });
  });
}
// function createListAccount(req, res) {
//   const { username, password } = req.body;
//   if ( !username || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   createCustomerAccount(username, password, (err) =>{
//     if (err)
//   })
// }

function readAllAccountsHandler(req, res) {
  readAllAccounts((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
}

function readAccountByIdHandler(req, res) {
  const { accountId } = req.params;

  // Check input data
  if (!accountId) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  readAccountById(accountId, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Account not found" });
    res.status(200).json(row);
  });
}

function updateAccountHandler(req, res) {
  const { accountId } = req.params;
  const { accountType, username, password } = req.body;

  // Check input data
  if (!accountId || !accountType || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  updateAccount(accountId, accountType, username, password, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Account updated successfully" });
  });
}

function deleteAccountHandler(req, res) {
  const { accountId } = req.params;

  // Check input data
  if (!accountId) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  deleteAccount(accountId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Account deleted successfully" });
  });
}
function restoreAccountHandler(req, res) {
  const { accountId } = req.params;

  // Check input data
  if (!accountId) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  restoreAccount(accountId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Account deleted successfully" });
  });
}

module.exports = {
  createAccountHandler,
  readAllAccountsHandler,
  readAccountByIdHandler,
  updateAccountHandler,
  deleteAccountHandler,
  // createListAccount,
  restoreAccountHandler,
};
