// controller/recipe.js

const Recipes = require("../models/recipe");
const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// Get recipe by ID
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// Add new recipe/event
const addEvent = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("File:", req.file);
    console.log("Body:", req.body);

    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions) {
      return res
        .status(400)
        .json({ message: "Required fields can't be empty" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients:
        typeof ingredients === "string"
          ? ingredients.split(",")
          : ingredients,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id,
    });

    return res.json(newRecipe);
  } catch (err) {
    console.error("Error in addEvent:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// Edit recipe
const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;
  try {
    let recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error editing recipe:", err);
    return res.status(500).json({ message: "Failed to update recipe" });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    return res.status(400).json({ message: "Error deleting recipe" });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addEvent,
  editRecipe,
  deleteRecipe,
  upload,
};

