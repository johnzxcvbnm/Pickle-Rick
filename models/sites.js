//Model for the practice websites

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Title: Generic title for the data (Week 1, Week 2, etc.)
//Description: A small description if needed
//Address: The website URL to practice
//Image: A saved image of the website in case the website goes down
//Readme: A URL linking to the readme of the site
//Comments: General user Comments
const siteSchema = mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  address: String,
  image: String,
  readme: String,
  comments: { type: Array, default: [] }
});

module.exports = mongoose.model("Sites", siteSchema);
