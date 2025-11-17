import { useEffect, useState } from 'react'
import { LogIn, LogOut, UserCircle2 } from 'lucide-react'

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const u = localStorage.getItem('user'); if (u) setUser(JSON.parse(u))
  },[])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    onLogout?.()
  }

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight text-slate-900">School Club</a>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-2 text-slate-700"><UserCircle2 className="w-5 h-5"/> {user.name} <span className="text-xs px-2 py-0.5 rounded bg-slate-100">{user.role}</span></span>
              <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black"><LogOut className="w-4 h-4"/> Logout</button>
            </>
          ) : (
            <a href="#login" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black"><LogIn className="w-4 h-4"/> Login</a>
          )}
        </nav>
      </div>
    </header>
  )
}
