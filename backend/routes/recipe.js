const express = require("express");
const { getRecipes, getRecipe, addEvent, editRecipe, deleteRecipe, upload } = require("../controller/recipe");
const verifyToken = require("../middleware/verifyToken");

const Recipe = require('../models/recipe');
const router = express.Router();

router.get("/", getRecipes); 
router.get("/:id", getRecipe);
router.post("/", verifyToken, upload.single('file'), addEvent);
router.put("/:id", upload.single('file'), editRecipe); 
router.delete("/:id", deleteRecipe); 

router.post('/participant/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { email } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Event not found' });

    
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


router.get('/:id/participants', verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.id; 
    const recipe = await Recipe.findById(recipeId); 

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

 
    res.json(recipe.participants || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load participants' });
  }
});


module.exports = router;
