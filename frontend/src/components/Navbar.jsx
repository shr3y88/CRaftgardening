import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
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
          <Nav to="/auth" label="Login" />
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


