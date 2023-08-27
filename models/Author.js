const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    maxlength: [200, "Author can not be more than 200 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Author", AuthorSchema);
