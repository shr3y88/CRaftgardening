import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  console.log('ProtectedRoute check - token:', token ? 'exists' : 'missing')
  
  if (!token) {
    console.log('No token found, redirecting to auth')
    return <Navigate to="/auth" replace />
  }
  
  console.log('Token found, rendering children')
  return children
}
