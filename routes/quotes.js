const express = require("express");

const {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("../controllers/quotes");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getQuotes).post(protect, createQuote);

router
  .route("/:id")
  .get(protect, getQuote)
  .put(protect, updateQuote)
  .delete(protect, deleteQuote);

module.exports = router;
