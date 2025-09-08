const express = require('express');
const axios = require('axios');
const router = express.Router();

const PERENUAL_API_KEY = 'sk-NWiU681ed4178847e10346'; // Replace with your actual key

router.get('/plants/:type?', async (req, res) => {
  try {
    const response = await axios.get(
      `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&page=1`
    );

    let plants = response.data.data.map(p => ({
      name: p.common_name || 'Unknown Plant',
      type: p.indoor ? 'Indoor' : 'Outdoor',
      description: p.scientific_name?.join(', ') || 'No description available',
      image: p.default_image?.original_url || ''
    }));

   
    if (req.params.type) {
      const filterType = req.params.type.toLowerCase();
      plants = plants.filter(p => p.type.toLowerCase() === filterType);
    }

    res.json(plants);
  } catch (err) {
    console.error("Error fetching plants:", err.message);
    res.status(500).json({ message: "Failed to fetch plant data" });
  }
});


module.exports = router;

