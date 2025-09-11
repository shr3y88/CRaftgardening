import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function Plants() {
  const [indoor, setIndoor] = useState([])
  const [outdoor, setOutdoor] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const [inRes, outRes] = await Promise.all([
          axios.get(`${API_BASE}/api/plants?type=indoor`),
          axios.get(`${API_BASE}/api/plants?type=outdoor`)
        ])
        setIndoor(inRes.data.plants)
        setOutdoor(outRes.data.plants)
      } finally {
        setLoading(false)
      }
    }
    fetchPlants()
  }, [])

  if (loading) return <p>Loading plants...</p>

  return (
    <div className="space-y-10">
      <PlantSection title="Indoor Plants" items={indoor} />
      <PlantSection title="Outdoor Plants" items={outdoor} />
    </div>
  )
}

function PlantSection({ title, items }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-slate-500">No plants available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p._id} className="border rounded-xl p-4 bg-white">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-36 w-full object-cover rounded-lg" /> : null}
              <h3 className="mt-3 font-medium text-emerald-800">{p.name}</h3>
              <p className="text-sm text-slate-600">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}


