import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onAuth?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demo = async () => {
    setLoading(true)
    setError('')
    try {
      await fetch(`${API}/demo/bootstrap`, { method: 'POST' })
      setEmail('admin@club.edu')
      setPassword('admin123')
    } catch (e) {
      setError('Could not create demo users')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="login" className="py-10">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-slate-800">Sign in</h2>
        <p className="text-slate-600 text-sm">Use your Admin, SPOC, or Student account.</p>
        <form className="mt-4 space-y-3" onSubmit={login}>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border px-3 py-2" required />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border px-3 py-2" required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
            <button type="button" onClick={demo} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">Create demo</button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-500">Demo creds after create: admin@club.edu / admin123, spoc@club.edu / spoc123, student@club.edu / student123</p>
      </div>
    </section>
  )
}
