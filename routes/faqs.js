const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { faqCollection } = require("../index");


//adding faqs
router.post("/add_faq", async (req, res) => {
  const faq = req.body;
  faq.createAt = new Date();
  
  const result = await faqCollection.insertOne(faq);
  res.send(result);
});

//get all appointments
router.get("/faq", async (req,res) => {
    const result = await faqCollection
      .find()
      .sort({ createAt: -1 })
      .toArray();
    res.send(result);
});


//delete selected faq
router.delete("/singlefaq/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await faqCollection.deleteOne(query);
    res.send(result);
});
  

module.exports = router;