const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { usersCollection, verifyJWT } = require("../index");

// get all users 
router.get("/users",verifyJWT, async (req, res) => {
  try {
    const result = await usersCollection.find().sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
// get consultants
router.get("/allconsultants",verifyJWT, async (req, res) => {
  try {
    const consultants = await usersCollection.find({ role: "consultant" }).sort({ createdAt: -1 }).toArray();
    res.send(consultants);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch consultants" });
  }
});

router.get("/userinfo", async (req, res) => {
  try {
    const email = req?.query?.email;
    console.log(email);

    const query = { email: email };
    const result = await usersCollection.findOne(query);

    if (!result) {
      // If no user with the specified email is found, send a 404 Not Found response
      return res.status(404).json({ message: "User not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await usersCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//get user by Name
router.get("/user-name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    // console.log(name);
    const query = { displayName: name };

    const result = await usersCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = req?.body;
    user.createdAt = new Date();
    console.log(user);
    const query = { email: user?.email };
    const existingUser = await usersCollection.findOne(query);
    
    if (existingUser) {
      return res.send({ message: "user exists" });
    }
    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.patch("/userinfoupdate", async (req, res) => {
  try {
    const query = req?.query?.email;
    const filter = { email: query };
    const userinfo = req?.body;
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        displayName: userinfo?.displayName,
        address: userinfo?.address,
        phone: userinfo?.phone,
        occupation: userinfo?.occupation,
        position: userinfo?.position,
        field: userinfo?.field,
        job: userinfo?.job,
        description: userinfo?.description,
        social: userinfo?.social,
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    console.log(result);
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
// Consultant info update
router.patch("/consultantinfoupdate", async (req, res) => {
  try {
    const query = req?.query?.email;
    const filter = { email: query };
    const userinfo = req?.body;
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        displayName: userinfo?.displayName,
        email: userinfo?.email,
        phone: userinfo?.phone,
        designation: userinfo?.designation,
        description: userinfo?.description,
        recentWorks: userinfo?.recentWorks,
        successes: userinfo?.successes,
        experience: userinfo?.experience,
        qualification: userinfo?.qualification,
        availability: userinfo?.availability,
        selectedDays: userinfo?.selectedDays,
        workingWith: userinfo?.workingWith,
        summary: userinfo?.summary,
        facebook: userinfo?.facebook,
        linkedin: userinfo?.linkedin,
        twitter: userinfo?.twitter,
        github: userinfo?.github,
        prefertime: userinfo?.prefertime,
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    console.log(result);
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.patch("/userpictureupdate", async (req, res) => {
  try {
    console.log("server clicked");
    const query = req?.query?.email;
    const filter = { email: query };
    const photo = req?.body;
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        photoURL: photo?.photoURL,
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    console.log(result);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.get("/users/admin/:email", async (req, res) => {
  try {
    const email = req?.params?.email;
    if (req?.decoded?.email !== email) {
      return res.send({ admin: false });
    }
    console.log(req?.decoded?.email);
    console.log("admin email", email);
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    const result = { admin: user?.role === "admin" };
    console.log("result", result);
    res.send(result);
  } catch (error) {
    console.error("Error checking admin role:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.patch("/users/admin/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//admin related api
router.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  console.log("admin mail", email);
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const result = { admin: user?.role === "admin" };
  res.send(result);
});
//making admin api
router.patch("/users/admin/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id of user", id);
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: "admin",
    },
  };
  console.log(updateDoc);

  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// consultant related api
router.get("/users/consultant/:email",verifyJWT, async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const result = { consultant: user?.role === "consultant" };
  res.send(result);
});

// making consultant api
router.patch("/users/consultant/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id of user", id);
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: "consultant",
    },
  };
  console.log(updateDoc);

  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// making user api
router.patch("/users/user/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id of user", id);
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: "user",
    },
  };
  console.log(updateDoc);

  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});

module.exports = router;
