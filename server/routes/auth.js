const express = require("express");
const router = express.Router();

const authServices = require("../services/auth");

router.post("/", (req, res) => authServices.login(req, res));

module.exports = router;
