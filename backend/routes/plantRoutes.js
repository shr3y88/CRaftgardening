const express = require('express');
const axios = require('axios');
const router = express.Router();

const PERENUAL_API_KEY = 'sk-NWiU681ed4178847e10346'; // Replace with your actual key

router.get('/plants', async (req, res) => {
  try {
    const response = await axios.get(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&page=1`);
    
    const plants = response.data.data.map(p => ({
      name: p.common_name || 'Unknown Plant',
      type: p.indoor ? 'Indoor' : 'Outdoor',
      description: p.scientific_name?.join(', ') || 'No description available',
      image: p.default_image?.original_url || ''
    }));

    res.json(plants);
  } catch (err) {
    console.error("Error fetching plants:", err.message);
    res.status(500).json({ message: "Failed to fetch plant data" });
  }
});

module.exports = router;
