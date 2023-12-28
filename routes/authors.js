const express = require("express");

const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authors");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getAuthors).post(protect, createAuthor);

router
  .route("/:id")
  .get(protect, getAuthor)
  .put(protect, updateAuthor)
  .delete(protect, deleteAuthor);

module.exports = router;
