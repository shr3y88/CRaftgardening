import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function Events() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' })
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const fetchEvents = async () => {
    const res = await axios.get(`${API_BASE}/api/events`)
    setEvents(res.data.events)
  }

  useEffect(() => { fetchEvents() }, [])

  const createEvent = async (e) => {
    e.preventDefault()
    await axios.post(`${API_BASE}/api/events`, form, { headers: { Authorization: `Bearer ${token}` }})
    setForm({ title: '', description: '', date: '', location: '' })
    fetchEvents()
  }

  const participate = async (eventId) => {
    const name = prompt('Your name?')
    const age = Number(prompt('Your age?'))
    const phone = prompt('Phone?')
    if (!name || !age || !phone) return
    await axios.post(`${API_BASE}/api/participants`, { eventId, name, age, phone }, token ? { headers: { Authorization: `Bearer ${token}` }} : {})
    alert('Registered!')
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="md:col-span-1">
        <h2 className="text-xl font-semibold text-emerald-800 mb-3">Create Event</h2>
        <form onSubmit={createEvent} className="space-y-3 border rounded-xl p-4 bg-white">
          <input required placeholder="Title" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <input required type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <input required placeholder="Location" className="input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
          <textarea placeholder="Description" className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <button className="btn-primary">Create</button>
        </form>
      </section>
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold text-emerald-800 mb-3">Events</h2>
        <div className="space-y-4">
          {events.map(ev => (
            <div key={ev._id} className="border rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-emerald-800">{ev.title}</h3>
                  <p className="text-sm text-slate-600">{new Date(ev.date).toLocaleString()} • {ev.location}</p>
                </div>
                <button onClick={() => participate(ev._id)} className="btn-secondary">Participate</button>
              </div>
              {ev.description && <p className="mt-2 text-slate-700">{ev.description}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


