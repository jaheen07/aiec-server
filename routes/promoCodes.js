const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { promoCodesCollection } = require("../index");

router.post("/promo", async (req, res) => {
  try {
    const promoCode = req?.body;
    // console.log(promoCode);
    const result = await promoCodesCollection.insertOne(promoCode);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error adding promo code:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.get("/promo", async (req, res) => {
  try {
    // Fetch promotional codes from the collection
    const result = await promoCodesCollection.find().toArray();
    res.json(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching promotional codes:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/promo/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await promoCodesCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error deleting promo code:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});


// update promo
router.patch("/updatepromo/:id", async (req, res) => {
  
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedpromo = req.body;
    console.log(updatedpromo);
    console.log(updatedpromo);
    

    const promo = {
      $set: {
        show_on_rib: updatedpromo.show_on_rib,
      },
    };
    const result = await promoCodesCollection.updateOne(filter, promo, option);
    res.send(result);
  } catch (error) {
    console.error("Error updating promo:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
