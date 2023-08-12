const express = require("express");

const {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("../controllers/quotes");

const router = express.Router();

router.route("/").get(getQuotes).post(createQuote);

router.route("/:id").get(getQuote).put(updateQuote).delete(deleteQuote);

module.exports = router;
