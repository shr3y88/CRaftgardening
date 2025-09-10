import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Plants() {
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])
  const [activeType, setActiveType] = useState('All')
  const [loading, setLoading] = useState(true)
  const API_BASE = "https://craftgardening-3.onrender.com";

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/plants`)
      setPlants(res.data)
      setFilteredPlants(res.data)
    } catch (err) {
      console.error("Error fetching plants:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (type) => {
    setActiveType(type)
    if (type === 'All') {
      setFilteredPlants(plants)
    } else {
      setFilteredPlants(
        plants.filter(p => p.type.toLowerCase() === type.toLowerCase())
      )
    }
  }

  return (
    <div className="plant-page">
      <h1>Explore Plants</h1>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['All', 'Indoor', 'Outdoor'].map((type) => (
          <button
            key={type}
            className={activeType === type ? 'active' : ''}
            onClick={() => handleFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading plants...</p>
      ) : (
        <div className="plant-list">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant, index) => (
              <div key={index} className="plant-card">
                <img
                  src={plant.image || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
                  alt={plant.name}
                />
                <h3>{plant.name}</h3>
                <p>{plant.description}</p>
                <span className="badge">{plant.type}</span>
              </div>
            ))
          ) : (
            <p>No plants found for "{activeType}"</p>
          )}
        </div>
      )}
    </div>
  )
}

