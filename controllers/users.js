//Dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const router = express.Router();

//POST routes
//Route creates a new user with an encrypted password
router.post("/", (req, res) => {
  //Encrypt the users password
  req.body.password = bcrypt.hashSync( req.body.password, bcrypt.genSaltSync(10) );
  //Create a new user, send a (201: 'User Created') message if successful
  User.create( req.body, (err, createdUser) => {
    //Newly created Users are automatically logged in
    // req.session.currentUser = createdUser;
    res.status(201).json({
      status: 201,
      message: "User Created"
    });
  });
});

//PUT Routes
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate( req.params.id, req.body, { new: true }, (err, updatedUser) => {
    res.json(updatedUser);
  });
});

//DELETE Routes
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove( req.params.id, (err, deletedUser) => {
    res.json(deletedUser);
  });
});

//Export the routes to the controller
module.exports = router;
