// routes/participantRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Participant = require("../models/Participant");

// POST - Add participant to a recipe
router.post("/:recipeId", verifyToken, async (req, res) => {
  try {
    const { name, age, phone } = req.body;
    const { recipeId } = req.params;

    const newParticipant = new Participant({
      recipeId,
      name,
      age,
      phone,
      userId: req.user.id, // from JWT
    });

    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (err) {
    res.status(500).json({ message: "Error saving participant" });
  }
});

// GET - Get participants for a specific recipe
router.get("/:recipeId", verifyToken, async (req, res) => {
  try {
    const participants = await Participant.find({ recipeId: req.params.recipeId });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching participants" });
  }
});

module.exports = router;
