const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a quote"],
    unique: true,
    trim: true,
    maxlength: [400, "Quote can not be more than 400 characters"],
  },
  author: {
    type: String,
    maxlength: [128, "Author can not be more than 128 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quote", QuoteSchema);
