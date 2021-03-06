//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();

//User Heroku specific values, or local specific values
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/css2go_app";
const port = process.env.PORT || 3000;

//Sessions
app.use(session({
  secret: "feedmeseymour",
  resave: false,
  saveUninitialized: false
}));

//Middleware
app.use(express.json());
app.use(express.static("public"));

//Controllers
//SITE CONTROLLER

const siteController = require("./controllers/sites.js");
app.use("/sites", siteController);

const userController = require("./controllers/users.js");
app.use("/users", userController);

const sessionController = require("./controllers/sessions.js");
app.use("/sessions", sessionController);

//Get Routes
//Route allows the current session to be passed from the backend framework to the front end framework
app.get("/log", (req, res) => {
  //If the user is currently logged in, pass the current session as a json file
  if(req.session.currentUser){
    res.json(req.session.currentUser);
    //If the user is not currently logged in
    //Send a (401: "Not logged in") message
  } else {
    res.status(401).json({
      status: 401,
      message: "Not logged in"
    });
  }
});

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
