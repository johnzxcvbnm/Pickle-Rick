//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();

//User Heroku specific values, or local specific values
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/css2go_app";
const port = process.env.PORT || 3000;

//Sessions
//Create later

//Middleware
app.use(express.json());
app.use(express.static("public"));

//Controllers


//Listen Route
app.listen(port, () => {
  console.log("Squanching on port: ", port);
});

//Mongoose Connection
mongoose.connect(mongoUri, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("Connected to Mongoose.  Quack!");
});

//END OF FILE
