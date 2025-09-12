import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}
