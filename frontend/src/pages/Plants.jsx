import React, { useEffect, useState } from 'react'
import axios from 'axios'


export default function Plants() {
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])
  const [activeType, setActiveType] = useState('All')
  const API_BASE = "https://craftgardening-3.onrender.com";

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    const res = await axios.get(`${API_BASE}/api/plants`)
    setPlants(res.data)
    setFilteredPlants(res.data)
  }

  const handleFilter = (type) => {
    setActiveType(type)
    if (type === 'All') {
      setFilteredPlants(plants)
    } else {
      setFilteredPlants(plants.filter(p => p.type === type))
    }
  }

  return (
    <div className="plant-page">
      <h1>Explore Plants</h1>
      <div className="filter-buttons">
        <button className={activeType === 'All' ? 'active' : ''} onClick={() => handleFilter('All')}>All</button>
        <button className={activeType === 'Indoor' ? 'active' : ''} onClick={() => handleFilter('Indoor')}>Indoor</button>
        <button className={activeType === 'Outdoor' ? 'active' : ''} onClick={() => handleFilter('Outdoor')}>Outdoor</button>
      </div>

      <div className="plant-list">
        {filteredPlants.map((plant, index) => (
          <div key={index} className="plant-card">
            <img src={plant.image || 'https://via.placeholder.com/250'} alt={plant.name} />
            <h3>{plant.name}</h3>
            <p>{plant.description}</p>
            <span className="badge">{plant.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


