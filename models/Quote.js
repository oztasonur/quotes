const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a quote"],
    unique: true,
    trim: true,
    maxlength: [400, "Quote can not be more than 400 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Author",
    required: true,
  },
});

module.exports = mongoose.model("Quote", QuoteSchema);
