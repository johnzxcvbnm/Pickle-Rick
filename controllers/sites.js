//File contains basic routes for the sites model

//Dependencies
const express = require("express");
const Site = require("../models/sites.js");
const router = express.Router();

//GET Routes
//This route pulls everthing from the database
router.get("/", (req, res) => {
  Site.find({}).exec( (err, foundSites) => {
    res.json(foundSites);
  });
});

//POST Routes
router.post("/", (req, res) => {
  Site.create( req.body, (err, createdSite) => {
    res.json(createdSite);
  });
});

//PUT Routes
router.put("/:id", (req, res) => {
  Site.findByIdAndUpdate( req.params.id, req.body, { new: true }, (err, updatedSite) => {
    res.json(updatedSite);
  });
});

//DELETE Routes
router.delete("/:id", (req, res) => {
  Site.findByIdAndRemove( req.params.id, (err, deletedSite) => {
    res.json(deletedSite);
  });
});

//Export the routes to the sites controller
module.exports = router;

// https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Public-domain-symbol.svg/256px-Public-domain-symbol.svg.png
