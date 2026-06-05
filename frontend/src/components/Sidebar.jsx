import { ADMIN_NAVLINKS, LOGISTIQUE_NAVLINKS, MAGASINIER_NAVLINKS, LABO_NAVLINKS, PROF_NAVLINKS } from "../constants/cst"
import { useRole } from "../contexts/RoleContext"
import { Link, useNavigate } from "react-router-dom"

function Sidebar() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()

  const getNavLinks = () => {
    const r = role?.toUpperCase()
    if (r === "ADMIN") return ADMIN_NAVLINKS
    if (r === "RESPONSABLE_LOGISTIQUE") return LOGISTIQUE_NAVLINKS
    if (r === "MAGASINIER") return MAGASINIER_NAVLINKS
    if (r === "RESPONSABLE_LABO") return LABO_NAVLINKS
    if (r === "PROFESSEUR") return PROF_NAVLINKS
    return []
}

  const handleLogout = () => {
    localStorage.removeItem("token")
    setRole("") 
    navigate("/")
  }

  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col h-full">
      
      <div className="p-4 border-b border-slate-600">
        <p className="font-bold text-lg">{role}</p>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-slate-400 text-xs uppercase mb-3 ">Menu</p>
        <ul className="space-y-2">
          {getNavLinks().map((n) => (
            <li key={n.id}>
              <Link 
                to={n.path} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-slate-700 transition duration-200 text-slate-300 hover:text-white w-full">
                {n.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bouton Logout */}
      <div className="p-4 border-t border-slate-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-600 transition duration-200 text-slate-300 hover:text-white w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>

    </div>
  )
}
export default Sidebar