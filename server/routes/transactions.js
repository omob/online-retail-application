const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const transactionServices = require("../services/transactions");
const automate = require("../cron/automate");

router.post("/", (req, res) => authServices.login(req, res));

router.get("/verify/:id", (req, res) => {
  transactionServices.verifyTransaction(req, res);
});

router.get("/automate/execute", async (req, res) => {
  await automate.execute();
  res.send("Done");
});

router.post("/oneoff", auth, (req, res) => {
  transactionServices.oneoffpayment(req, res);
});

module.exports = router;
