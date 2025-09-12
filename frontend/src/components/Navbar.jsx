import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }
    
    // Check auth on mount and when location changes
    checkAuth()
    
    // Listen for storage changes (when token is added/removed)
    window.addEventListener('storage', checkAuth)
    
    // Listen for custom login event
    window.addEventListener('userLoggedIn', checkAuth)
    window.addEventListener('userLoggedOut', checkAuth)
    
    // Check when route changes (in case user navigates after login)
    const interval = setInterval(checkAuth, 500)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('userLoggedIn', checkAuth)
      window.removeEventListener('userLoggedOut', checkAuth)
      clearInterval(interval)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    // Dispatch custom event to notify of logout
    window.dispatchEvent(new CustomEvent('userLoggedOut'))
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-emerald-600 inline-flex items-center justify-center text-white font-bold">C</span>
          <span className="font-bold text-lg md:text-xl text-emerald-700">CRaftGardening</span>
        </Link>
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <Nav to="/" label="Home" />
          <Nav to="/plants" label="Plants" />
          <Nav to="/events" label="Events" />
          {isAuthenticated ? (
            <>
              <Nav to="/dashboard" label="Dashboard" />
              <button 
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Nav to="/auth" label="Login" />
          )}
        </div>
      </nav>
    </header>
  )
}

function Nav({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'}`}
    >
      {label}
    </NavLink>
  )
}



