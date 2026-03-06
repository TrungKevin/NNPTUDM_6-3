var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users');

// GET all users (not deleted)
router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({}).populate({ path: 'role', select: 'name' });
    let result = data.filter(function (e) {
      return (!e.isDeleted);
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET user by ID (not deleted)
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findById(req.params.id).populate({ path: 'role', select: 'name' });
    if (result && !result.isDeleted) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: "INVALID ID" });
  }
});

// POST enable user
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "Email and username are required" });
    }
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (result) {
      res.status(200).send({ message: "User enabled successfully", user: result });
    } else {
      res.status(404).send({ message: "User not found or credentials mismatch" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST disable user
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "Email and username are required" });
    }
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (result) {
      res.status(200).send({ message: "User disabled successfully", user: result });
    } else {
      res.status(404).send({ message: "User not found or credentials mismatch" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST new user
router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newObj.save();
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (result && !result.isDeleted) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE soft delete user
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
