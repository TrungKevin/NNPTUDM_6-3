var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles');

// GET all roles (not deleted)
router.get('/', async function (req, res, next) {
    try {
        let data = await roleSchema.find({});
        let result = data.filter(function (e) {
            return (!e.isDeleted);
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by ID (not deleted)
router.get('/:id', async function (req, res, next) {
    try {
        let result = await roleSchema.findById(req.params.id);
        if (result && !result.isDeleted) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "ROLE NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: "INVALID ID" });
    }
});

// POST new role
router.post('/', async function (req, res, next) {
    try {
        let newObj = new roleSchema({
            name: req.body.name,
            description: req.body.description
        });
        await newObj.save();
        res.status(201).send(newObj);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
    try {
        let result = await roleSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (result && !result.isDeleted) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "ROLE NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE soft delete role
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await roleSchema.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "ROLE NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
