import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="text-center">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-10 md:p-14 mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow">Grow a greener life</h1>
          <p className="mt-3 md:mt-4 text-emerald-50 max-w-2xl mx-auto">
            Discover plants, join events, and get quick care tips with our AI helper.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 md:gap-4">
            <Link to="/plants" className="btn-primary">Explore Plants</Link>
            <Link to="/events" className="btn-secondary border-white text-white hover:bg-white/10">Upcoming Events</Link>
          </div>
        </div>
        <Decorations />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Indoor Plants" desc="Low-light friends for cozy corners." />
        <Card title="Outdoor Plants" desc="Sun-loving beauties for your garden." />
      </div>
    </section>
  )
}

function Card({ title, desc }) {
  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm animate-fadeInUp">
      <h3 className="text-xl font-semibold text-emerald-800">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  )
}

function Decorations() {
  return (
    <>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/30 blur-xl animate-float" />
      <div className="absolute -left-10 -bottom-12 h-52 w-52 rounded-full bg-teal-300/30 blur-xl animate-float" style={{animationDelay:'1s'}} />
      <div className="absolute right-10 bottom-6 h-6 w-6 rounded-full bg-white/40 animate-float" style={{animationDuration:'6s'}} />
    </>
  )
}


