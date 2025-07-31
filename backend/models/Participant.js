const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Participant", participantSchema);
