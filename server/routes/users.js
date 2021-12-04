const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const userServices = require("../services/users");
const adminServices = require("../services/admin");

router.get("/me", auth, (req, res) => {
  userServices.getProfile(req, res);
});

router.put("/me/change-password", auth, (req, res) => {
  userServices.changePassword(req, res);
});

router.put("/me", auth, (req, res) => {
  userServices.updateProfile(req, res);
});

router.post("/", async (req, res) => {
  userServices.register(req, res);
});

// subscribe to a product
router.post("/subscriptions", auth, (req, res) => {
  userServices.subscribeToProduct(req, res);
});

// get all get user subscriptions
router.get("/subscriptions", auth, (req, res) => {
  userServices.getSubscriptions(req, res);
});

// deletes a subscription or unsubscribe from a product
router.delete("/subscriptions/:id", auth, validateObjectId, (req, res) => {
  userServices.unsubscribe(req, res);
});

router.get("/cardstatus", auth, (req, res) => {
  userServices.getCardStatus(req, res);
});

router.post("/creditcard", auth, (req, res) => {
  userServices.addCreditCard(req, res);
});

/********************* ADMIN **************************/

// register new user - POST - /api/users
router.post("/register", auth, admin, async (req, res) =>
  adminServices.registerUser(req, res)
);

router.get("/roles", async (req, res) => {
  adminServices.getRoles(req, res);
});

router.put("/revoke", auth, admin, async (req, res) => {
  adminServices.manageAccess(req, res);
});

// get user profile (admin getting other users' profile)
router.get("/:id", auth, admin, validateObjectId, async (req, res) => {
  adminServices.getUserProfile(req, res);
});

router.get("/", auth, admin, async (req, res) => {
  adminServices.getAllUsers(req, res);
});

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  adminServices.deleteUser(req, res);
});

module.exports = router;
