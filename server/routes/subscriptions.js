const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const subscriptionServices = require("../services/subscriptions");

router.get("/plans", (req, res) => {
  subscriptionServices.fetchSubscriptionPlans(req, res);
});

router.post("/plans", auth, admin, async (req, res) => {
  subscriptionServices.createPlan(req, res);
});

// get all users that have subscribed to a product
router.get("/", auth, admin, async (req, res) => {
  subscriptionServices.fetchAllUsersWithSubscriptions(req, res);
});

// get all user subscriptions
router.get("/:id", auth, admin, validateObjectId, async (req, res) => {
  subscriptionServices.fetchAllUserSubscriptions(req, res);
});

module.exports = router;
