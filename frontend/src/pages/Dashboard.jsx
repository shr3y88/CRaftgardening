import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchUserEvents()
  }, [])

  const fetchUserEvents = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to view your dashboard')
        return
      }

      const response = await axios.get(`${API_BASE}/api/events/my-events-with-participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setEvents(response.data.events)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalParticipants = () => {
    return events.reduce((total, event) => total + event.participants.length, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchUserEvents}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">My Dashboard</h1>
        <p className="text-slate-600">Manage your events and view participants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Events</p>
              <p className="text-2xl font-bold text-emerald-800">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Participants</p>
              <p className="text-2xl font-bold text-blue-800">{getTotalParticipants()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avg. per Event</p>
              <p className="text-2xl font-bold text-purple-800">
                {events.length > 0 ? Math.round(getTotalParticipants() / events.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800">Your Events</h2>
        
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border shadow-sm">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No events yet</h3>
            <p className="text-slate-500 mb-4">Create your first event to get started!</p>
            <a href="/events" className="btn-primary">Create Event</a>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                onViewParticipants={() => setSelectedEvent(event)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Participants Modal */}
      {selectedEvent && (
        <ParticipantsModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  )
}

function EventCard({ event, onViewParticipants, formatDate }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{event.title}</h3>
          <p className="text-slate-600 mb-3">{event.description || 'No description provided'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600 mb-1">{event.participants.length}</div>
          <div className="text-sm text-slate-500">participants</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Created {formatDate(event.createdAt)}
        </div>
        <button 
          onClick={onViewParticipants}
          className="btn-secondary text-sm"
        >
          View Participants
        </button>
      </div>
    </div>
  )
}

function ParticipantsModal({ event, onClose, formatDate }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800">
              Participants for "{event.title}"
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-600 mt-1">
            {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {event.participants.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No participants yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {event.participants.map((participant, index) => (
                <div key={participant._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-800">{participant.name}</div>
                    <div className="text-sm text-slate-600">
                      Age: {participant.age} • Phone: {participant.phone}
                    </div>
                    <div className="text-xs text-slate-500">
                      Registered: {formatDate(participant.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t bg-slate-50">
          <button 
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
