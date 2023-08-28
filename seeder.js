const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });
const Quote = require("./models/Quote");
const Author = require("./models/Author");

mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const quote = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/quotes.json`, "utf-8")
);

const author = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/authors.json`, "utf-8")
);
// Import into DB

const importData = async () => {
  try {
    await Quote.create(quote);
    await Author.create(author);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Quote.deleteMany();
    await Author.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
