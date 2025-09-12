import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin ? { email: form.email, password: form.password } : form
      const res = await axios.post(`${API_BASE}${url}`, payload)
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        setMessage('Success! Redirecting to dashboard...')
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
        
        // Also try immediate redirect as backup
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setMessage('Login successful but no token received')
      }
    } catch (e) {
      console.error('Auth error:', e)
      setMessage(e?.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="border rounded-2xl p-6 bg-white">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form className="space-y-3" onSubmit={submit}>
          {!isLogin && (
            <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          )}
          <input required className="input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input required className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <button className="btn-primary w-full" type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <button className="mt-3 text-emerald-700" onClick={()=>setIsLogin(!isLogin)}>
          {isLogin ? 'Create an account' : 'Have an account? Login'}
        </button>
        {message && (
          <div className="mt-3">
            <p className="text-sm text-slate-600">{message}</p>
            {message.includes('Success') && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-2 btn-primary text-sm"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


