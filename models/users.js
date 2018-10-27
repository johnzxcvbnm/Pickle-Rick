//Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Schema
//Username: Choosen by the user, but must be unique
//Password: Required to verify login
//Avatar: Image URL
//Admin: Grants special Admin premissions
//Submissions: A list of all their submitted work

const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true},
  avatar: { type: String },
  admin: { type: Boolean, default: false },
  submissions: { type: [String], default: [] }
});

//Export the user module to the routes
module.exports = mongoose.model("User", userSchema);
