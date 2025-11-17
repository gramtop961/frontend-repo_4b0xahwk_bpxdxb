import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 shadow-xl ring-1 ring-white/60">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-transparent bg-clip-text">
            Club Management Portal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-700">
            A modern hub for admins, SPOCs, and students to collaborate, share posts, and access training resources.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#login" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Get Started</a>
            <a href="#resources" className="px-5 py-2.5 rounded-lg bg-white/70 text-blue-700 ring-1 ring-blue-200 hover:bg-white transition">Browse Resources</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30" />
    </section>
  )
}
