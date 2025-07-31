const express = require("express");
const { getRecipes, getRecipe, addEvent, editRecipe, deleteRecipe, upload } = require("../controller/recipe");
const verifyToken = require("../middleware/verifyToken");

const Recipe = require('../models/recipe');
const router = express.Router();

router.get("/", getRecipes); // Get all recipes
router.get("/:id", getRecipe); // Get recipe by ID
router.post("/", verifyToken, upload.single('file'), addEvent);
router.put("/:id", upload.single('file'), editRecipe); // Edit recipe
router.delete("/:id", deleteRecipe); // Delete recipe

// Endpoint for participating in an event
router.post('/participant/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { email } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Event not found' });

    // Initialize participants if it is not defined
    if (!recipe.participants) {
      recipe.participants = [];
    }

    if (!recipe.participants.includes(email)) {
      recipe.participants.push(email);
      await recipe.save();
    }

    res.status(200).json({ message: 'Participation recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get participants - Only for the creator
router.get('/:id/participants', verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.id; // Get the recipe ID from the URL
    const recipe = await Recipe.findById(recipeId); // Find the recipe by ID

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' }); // If no recipe found, return 404
    }

    // Return the list of participants or an empty array if there are no participants
    res.json(recipe.participants || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load participants' });
  }
});





module.exports = router;
