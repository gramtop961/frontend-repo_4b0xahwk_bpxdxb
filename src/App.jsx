import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'))

  useEffect(()=>{
    const handler = () => setAuthed(!!localStorage.getItem('token'))
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      <Navbar onLogout={()=>setAuthed(false)} />
      <Hero />
      <main>
        {!authed && <Auth onAuth={()=>setAuthed(true)} />}
        <Dashboard />
      </main>
      <footer className="mt-16 py-10 text-center text-sm text-slate-600">Built for modern school clubs — Admin, SPOC, and Student friendly.</footer>
    </div>
  )
}

export default App
