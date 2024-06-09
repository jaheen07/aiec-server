const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { WorkshopsCollection } = require("../index");

//User Part
//get all appointments
router.get("/workshops", async (req,res) => {
    const result = await WorkshopsCollection
      .find()
      .sort({ createAt: -1 })
      .toArray();
    res.send(result);
});

//get courses by ID
router.get("/singleworkshop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await WorkshopsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});


//get courses by Title
router.get("/single-workshop/:title", async (req, res) => {
  try {
    const title = req.params.title;
    console.log(title);
    const query = { title: title };

    const result = await WorkshopsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});




//Dashboard part
//adding courses
router.post("/add_workshop", async (req, res) => {
  const newworkshop = req.body;
  newworkshop.createAt = new Date();
  
  const result = await WorkshopsCollection.insertOne(newworkshop);
  res.send(result);
});


// delete courses
router.delete("/singleworkshop/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await WorkshopsCollection.deleteOne(query);
  res.send(result);
});

// update course
router.patch("/update-workshop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedCourse = req.body;
    

    const course = {
      $set: {
        title: updatedCourse.title,
        description: updatedCourse.description,
        subtitle: updatedCourse.subtitle,
        cover: updatedCourse.cover,
        coverVideo: updatedCourse.coverVideo,
        courseType: updatedCourse.courseType,
        liveInstruction: updatedCourse.liveInstruction,
        courseModel: updatedCourse.courseModel,
        courseFee: updatedCourse.courseFee,
        discount: updatedCourse.discount,
        spdiscount: updatedCourse.spdiscount,
        features: updatedCourse.features,
        Collaborators: updatedCourse.Collaborators,
        instructor: updatedCourse.instructor,
        insDesignation: updatedCourse.insDesignation,
        insDescription: updatedCourse.insDescription,
        insImage: updatedCourse.insImage,
        modules: updatedCourse.modules,
        startDate: updatedCourse.startDate,
        endDate: updatedCourse.endDate,
        courseDate: updatedCourse.courseDate,
        faqItems: updatedCourse.faqItems,
        
      },
    };
    const result = await WorkshopsCollection.updateOne(filter, course, option);
    res.send(result);
  } catch (error) {
    console.error("Error updating Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
  

module.exports = router;