const express = require("express");
const { 
  getRecipes, 
  getRecipe, 
  addEvent, 
  editRecipe, 
  deleteRecipe, 
  upload, 
  participateInEvent,   
  getParticipants        
} = require("../controller/recipe");

const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", getRecipes); 
router.get("/:id", getRecipe); 
router.post("/", verifyToken, upload.single('file'), addEvent); 
router.put("/:id", upload.single('file'), editRecipe); 
router.delete("/:id", deleteRecipe); 


router.post('/participant/:id', participateInEvent); 
router.get('/:id/participants', verifyToken, getParticipants); 

module.exports = router;
