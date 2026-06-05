import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'

function Layout() {
  const { role, darkMode } = useRole()
  const location = useLocation()

  const getTitle = () => {
    if (location.pathname.includes('utilisateurs')) return 'Gestion Utilisateurs'
    if (location.pathname.includes('laboratoires')) return 'Gestion Laboratoires'
    if (location.pathname.includes('parametres')) return 'Paramètres'
    if (location.pathname.includes('inventaire')) return 'Inventaire Global'
    if (location.pathname.includes('suivi')) return 'Suivi Matériel'
    if (location.pathname.includes('demandes')) return 'Demandes'
    if (location.pathname.includes('reception')) return 'Réception Équipements'
    if (location.pathname.includes('fiches')) return 'Fiches Matériel'
    if (location.pathname.includes('mouvements')) return 'Entrées / Sorties'
    if (location.pathname.includes('equipements')) return 'Mes Équipements'
    if (location.pathname.includes('disponibilite')) return 'Disponibilité & État'
    if (location.pathname.includes('professeur')) return 'Espace Professeur'
    return 'Dashboard'
  }

  return (
    <div className="flex h-full">
      <Sidebar role={role} />
      <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Header title={getTitle()} />
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default Layout