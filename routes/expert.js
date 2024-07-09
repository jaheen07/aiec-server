const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { ExpertsCollection } = require("../index");

//adding partner
router.post("/add-expert", async (req, res) => {
    const newExpert = req.body;
    newExpert.createAt = new Date();
    const result = await ExpertsCollection.insertOne(newExpert);
    res.send(result);
  });


router.get("/experts", async (req, res) => {
    const result = await ExpertsCollection.find().sort({ createAt: -1 }).toArray();
    res.send(result);
  });


module.exports = router;