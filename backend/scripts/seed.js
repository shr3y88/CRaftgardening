import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const plantSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: { type: String, enum: ['indoor', 'outdoor'] },
  imageUrl: String,
  careTips: String,
}, { timestamps: true });

const Plant = mongoose.models.Plant || mongoose.model('Plant', plantSchema);

const samplePlants = [
  { name: 'Snake Plant', type: 'indoor', description: 'Low-light tolerant.', imageUrl: 'https://images.unsplash.com/photo-1614595738115-5bcc8a7048c4', careTips: 'Water sparingly; bright, indirect light.' },
  { name: 'Pothos', type: 'indoor', description: 'Beginner-friendly vine.', imageUrl: 'https://images.unsplash.com/photo-1598899134739-24b3ba4b3caa', careTips: 'Allow top inch to dry; indirect light.' },
  { name: 'Aloe Vera', type: 'indoor', description: 'Succulent with gel.', imageUrl: 'https://images.unsplash.com/photo-1545249390-6bafb9d2f60a', careTips: 'Full sun; water infrequently.' },
  { name: 'Lavender', type: 'outdoor', description: 'Fragrant perennial.', imageUrl: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f', careTips: 'Full sun; well-drained soil.' },
  { name: 'Rosemary', type: 'outdoor', description: 'Woody herb.', imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', careTips: 'Sun; avoid overwatering.' },
  { name: 'Marigold', type: 'outdoor', description: 'Bright annual flowers.', imageUrl: 'https://images.unsplash.com/photo-1593696140827-0bf21cr', careTips: 'Full sun; moderate water.' },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  const count = await Plant.countDocuments();
  if (count === 0) {
    await Plant.insertMany(samplePlants);
    console.log(`Inserted ${samplePlants.length} plants.`);
  } else {
    console.log(`Skipping: ${count} plants already exist.`);
  }
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


