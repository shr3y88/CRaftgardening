const Recipes = require("../models/recipe");
const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// Get recipe by ID
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// Add new recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients: typeof ingredients === "string" ? ingredients.split(",") : ingredients,
      instructions,
      time,
      coverImage: req.file?.filename,
      createdBy: req.user.id,
    });

    res.json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Edit recipe
const editRecipe = async (req, res) => {
  try {
    let recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting recipe", error: err.message });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
