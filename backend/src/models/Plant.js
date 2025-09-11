import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['indoor', 'outdoor'], required: true },
    imageUrl: { type: String, default: '' },
    careTips: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Plant', plantSchema);


