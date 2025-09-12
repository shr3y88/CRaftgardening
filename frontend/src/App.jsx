import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Plants from './pages/Plants.jsx'
import Events from './pages/Events.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbox from './components/Chatbox.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/test-dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Chatbox />
    </div>
  )
}


