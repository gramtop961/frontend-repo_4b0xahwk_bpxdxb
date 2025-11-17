import { useEffect, useState } from 'react'
import { Bell, Plus, Trash2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])
  return user
}

export default function Dashboard() {
  const user = useAuth()
  const [posts, setPosts] = useState([])
  const [resources, setResources] = useState([])
  const [notifications, setNotifications] = useState([])
  const [toast, setToast] = useState(null)

  const token = localStorage.getItem('token')

  const fetchAll = async () => {
    const [p, r, n] = await Promise.all([
      fetch(`${API}/posts`).then((r)=>r.json()),
      fetch(`${API}/resources`).then((r)=>r.json()),
      fetch(`${API}/notifications`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then((r)=>r.json()),
    ])
    setPosts(p.items || [])
    setResources(r.items || [])
    setNotifications(n.items || [])
  }

  useEffect(() => { fetchAll() }, [])

  const createPost = async (e) => {
    e.preventDefault()
    const form = e.target
    const body = { title: form.title.value, content: form.content.value, visibility: form.visibility.value, tags: form.tags.value.split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await fetch(`${API}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    if (res.ok) {
      form.reset(); setToast({ type: 'success', msg: 'Post created' }); fetchAll()
    } else {
      const d = await res.json(); setToast({ type: 'error', msg: d.detail || 'Failed' })
    }
  }

  const deletePost = async (id) => {
    const res = await fetch(`${API}/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) { setToast({ type: 'success', msg: 'Post deleted' }); fetchAll() } else { setToast({ type: 'error', msg: 'Failed to delete' }) }
  }

  const createResource = async (e) => {
    e.preventDefault()
    const form = e.target
    const body = { title: form.rtitle.value, description: form.rdesc.value, url: form.rurl.value, category: form.rcat.value, tags: form.rtags.value.split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await fetch(`${API}/resources`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    if (res.ok) { form.reset(); setToast({ type: 'success', msg: 'Resource added' }); fetchAll() } else { const d = await res.json(); setToast({ type: 'error', msg: d.detail || 'Failed' }) }
  }

  const sendNotification = async (e) => {
    e.preventDefault()
    const form = e.target
    const body = { user_id: form.nu.value || null, title: form.nt.value, message: form.nm.value, type: form.ntype.value, link: form.nl.value || null }
    const res = await fetch(`${API}/notifications`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    if (res.ok) { form.reset(); setToast({ type: 'success', msg: 'Notification sent' }); fetchAll() } else { const d = await res.json(); setToast({ type: 'error', msg: d.detail || 'Failed' }) }
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-700" />
            {notifications.filter(n=>!n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {notifications.filter(n=>!n.read).length}
              </span>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {notifications.map(n => (
              <div key={n.id} className={`rounded-lg p-4 border ${n.type==='success'?'border-green-300 bg-green-50': n.type==='warning'?'border-yellow-300 bg-yellow-50': n.type==='error'?'border-red-300 bg-red-50':'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-sm text-slate-600">{n.message}</p>
                    {n.link && <a href={n.link} className="text-blue-600 text-sm underline">Open</a>}
                  </div>
                  {n.read ? <span className="text-xs text-slate-500">Read</span> : <span className="text-xs text-blue-600">New</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {(user?.role === 'admin' || user?.role === 'spoc') && (
              <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Plus className="w-4 h-4"/> New Post</h3>
                <form onSubmit={createPost} className="space-y-2">
                  <input name="title" placeholder="Title" className="w-full border rounded px-3 py-2" required />
                  <textarea name="content" placeholder="Content" className="w-full border rounded px-3 py-2" required />
                  <select name="visibility" className="w-full border rounded px-3 py-2">
                    <option value="public">Public</option>
                    <option value="members">Members</option>
                  </select>
                  <input name="tags" placeholder="tags, comma, separated" className="w-full border rounded px-3 py-2" />
                  <button className="w-full bg-blue-600 text-white rounded py-2">Publish</button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
              <h3 className="font-semibold mb-2">Send Notification</h3>
              <form onSubmit={sendNotification} className="space-y-2">
                <input name="nu" placeholder="User ID (optional)" className="w-full border rounded px-3 py-2" />
                <input name="nt" placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <textarea name="nm" placeholder="Message" className="w-full border rounded px-3 py-2" required />
                <select name="ntype" className="w-full border rounded px-3 py-2">
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                <input name="nl" placeholder="Link (optional)" className="w-full border rounded px-3 py-2" />
                <button className="w-full bg-indigo-600 text-white rounded py-2">Send</button>
              </form>
            </div>
          </div>
        </div>

        {/* Posts & Resources */}
        <div className="mt-10 grid md:grid-cols-2 gap-6" id="resources">
          <div className="bg-white rounded-xl shadow border border-slate-200">
            <div className="p-4 border-b"><h3 className="font-semibold">Latest Posts</h3></div>
            <div className="divide-y">
              {posts.map(p => (
                <div key={p.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-800">{p.title}</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{p.content}</p>
                      <div className="mt-1 flex gap-2 flex-wrap">
                        {(p.tags||[]).map((t,i)=>(<span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">#{t}</span>))}
                      </div>
                    </div>
                    {(user?.role==='admin' || user?.role==='spoc') && (
                      <button onClick={()=>deletePost(p.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-slate-200">
            <div className="p-4 border-b"><h3 className="font-semibold">Training Resources</h3></div>
            <div className="divide-y">
              {resources.map(r => (
                <div key={r.id} className="p-4">
                  <h4 className="font-semibold text-slate-800">{r.title}</h4>
                  {r.description && <p className="text-sm text-slate-600">{r.description}</p>}
                  {r.url && <a className="text-blue-600 underline text-sm" href={r.url} target="_blank">Open</a>}
                  <div className="mt-1 flex gap-2 flex-wrap">
                    {(r.tags||[]).map((t,i)=>(<span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">#{t}</span>))}
                  </div>
                </div>
              ))}
            </div>
            {(user?.role==='admin' || user?.role==='spoc') && (
              <div className="p-4 border-t">
                <form onSubmit={createResource} className="grid grid-cols-1 gap-2">
                  <input name="rtitle" placeholder="Title" className="w-full border rounded px-3 py-2" required />
                  <input name="rdesc" placeholder="Description" className="w-full border rounded px-3 py-2" />
                  <input name="rurl" placeholder="URL" className="w-full border rounded px-3 py-2" />
                  <input name="rcat" placeholder="Category" className="w-full border rounded px-3 py-2" />
                  <input name="rtags" placeholder="tags, comma, separated" className="w-full border rounded px-3 py-2" />
                  <button className="w-full bg-emerald-600 text-white rounded py-2">Add Resource</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white ${toast.type==='success'?'bg-green-600': toast.type==='error'?'bg-red-600':'bg-slate-800'}`}>
            {toast.msg}
          </div>
        )}
      </div>
    </section>
  )
}
