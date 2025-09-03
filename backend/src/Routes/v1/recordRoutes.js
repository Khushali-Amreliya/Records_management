const express = require("express");
const Record = require("../../Model/recordSchema");

const router = express.Router();

router.get("/list_records",
    async (req, res) => {
        const records = await Record.find();
        res.json(records);
    });

router.post("/add_records",
    async (req, res) => {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.json({ message: "Record added successfully", record: newRecord });
    });
router.put("/edit_records/:id",
    async (req, res) => {
        const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Record updated successfully", record: updated });
    });

module.exports = router;
