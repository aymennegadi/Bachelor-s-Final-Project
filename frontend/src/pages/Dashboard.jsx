import * as Icons from 'lucide-react'
import { useState, useEffect } from 'react'
import { ADMIN_STATS, LOGISTIQUE_STATS, MAGASINIER_STATS, LABO_STATS, PROF_STATS } from "../constants/cst"
import { useRole } from "../contexts/RoleContext"
import { getUtilisateurs, getLaboratoires } from '../services/adminService'
import { getEquipements, getMouvements } from '../services/magasinierService'
import { getDashboardLabo } from '../services/laboService'
import { getDashboardLogistique } from '../services/logistiqueService'
import { getDashboardProf } from '../services/professorService'

function Dashboard() {
  const { role, userId } = useRole()
  const [stats, setStats] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [role])

  const fetchDashboardData = async () => {
    try {
      const r = role?.toUpperCase()

      if (r === "ADMIN") {
        const users = await getUtilisateurs()
        const labs = await getLaboratoires()
        const activeUsers = users.filter(u => u.statut !== 'Inactif').length
        const inactiveUsers = users.filter(u => u.statut === 'Inactif').length
        setStats([
          { id: 1, title: "Total Utilisateurs",    value: users.length,                icon: "Users",     color: "bg-blue-100 text-blue-600" },
          { id: 2, title: "Total Laboratoires",    value: labs.length,                 icon: "Building2", color: "bg-green-100 text-green-600" },
          { id: 3, title: "Utilisateurs Actifs",   value: activeUsers || users.length, icon: "UserCheck", color: "bg-green-100 text-green-600" },
          { id: 4, title: "Utilisateurs Inactifs", value: inactiveUsers,               icon: "UserX",     color: "bg-red-100 text-red-600" },
        ])

        // 5 derniers utilisateurs triés par date
        const sorted = [...users]
          .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
          .slice(0, 5)
        setRecentUsers(sorted)

      } else if (r === "MAGASINIER") {
        const [equipements, mouvements] = await Promise.all([getEquipements(), getMouvements()])
        const today = new Date().toLocaleDateString('fr-FR')
        const sortiesDuJour = mouvements.filter(m =>
          m.type === 'SORTIE' &&
          new Date(m.date_mouvement).toLocaleDateString('fr-FR') === today
        ).length
        const stockTotal = equipements.reduce((acc, eq) => acc + eq.quantite, 0)
        const enAttente = mouvements.filter(m => m.type === 'ENTREE').length
        setStats([
          { id: 1, title: "Équipements reçus", value: equipements.length, icon: "PackageCheck", color: "bg-blue-100 text-blue-600" },
          { id: 2, title: "Sorties du jour",   value: sortiesDuJour,      icon: "PackageMinus", color: "bg-red-100 text-red-600" },
          { id: 3, title: "Stock Total",       value: stockTotal,         icon: "Boxes",        color: "bg-green-100 text-green-600" },
          { id: 4, title: "Mouvements Entrées",value: enAttente,          icon: "PackagePlus",  color: "bg-yellow-100 text-yellow-600" },
        ])

      } else if (r === "RESPONSABLE_LABO") {
        const data = await getDashboardLabo(userId)
        setStats([
          { id: 1, title: "Mes Équipements", value: data.totalEquipements, icon: "Monitor",       color: "bg-blue-100 text-blue-600" },
          { id: 2, title: "Disponibles",     value: data.disponibles,      icon: "CheckCircle",   color: "bg-green-100 text-green-600" },
          { id: 3, title: "En panne",        value: data.enPanne,          icon: "AlertTriangle", color: "bg-red-100 text-red-600" },
          { id: 4, title: "Mes Demandes",    value: data.demandesTotal,    icon: "ClipboardList", color: "bg-yellow-100 text-yellow-600" },
        ])

      } else if (r === "RESPONSABLE_LOGISTIQUE") {
        const data = await getDashboardLogistique()
        setStats([
          { id: 1, title: "Demandes en attente", value: data.demandesEnAttente, icon: "Clock",       color: "bg-yellow-100 text-yellow-600" },
          { id: 2, title: "Demandes validées",   value: data.demandesValidees,  icon: "CheckCircle", color: "bg-green-100 text-green-600" },
          { id: 3, title: "Demandes refusées",   value: data.demandesRefusees,  icon: "XCircle",     color: "bg-red-100 text-red-600" },
          { id: 4, title: "Total Équipements",   value: data.totalEquipements,  icon: "Boxes",       color: "bg-blue-100 text-blue-600" },
        ])

      } else if (r === "PROFESSEUR") {
        const data = await getDashboardProf(userId)
        setStats([
          { id: 1, title: "Mes Demandes",    value: data.totalDemandes,      icon: "ClipboardList", color: "bg-purple-100 text-purple-600" },
          { id: 2, title: "En attente",      value: data.demandesEnAttente,  icon: "Clock",         color: "bg-yellow-100 text-yellow-600" },
          { id: 3, title: "Validées",        value: data.demandesValidees,   icon: "CheckCircle",   color: "bg-green-100 text-green-600" },
          { id: 4, title: "Mes Signalements",value: data.totalSignalements,  icon: "AlertTriangle", color: "bg-orange-100 text-orange-600" },
        ])

      } else {
        setStats(getDefaultStats())
      }

    } catch (error) {
      console.error("Erreur fetch dashboard:", error)
      setStats(getDefaultStats())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultStats = () => {
    const r = role?.toUpperCase()
    if (r === "ADMIN") return ADMIN_STATS
    if (r === "RESPONSABLE_LOGISTIQUE") return LOGISTIQUE_STATS
    if (r === "MAGASINIER") return MAGASINIER_STATS
    if (r === "RESPONSABLE_LABO") return LABO_STATS
    if (r === "PROFESSEUR") return PROF_STATS
    return []
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      {/* Cartes statistiques */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => {
          const LucideIcon = Icons[stat.icon]
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <LucideIcon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-700">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tableau derniers utilisateurs - Admin seulement */}
      {role === "admin" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">Derniers Utilisateurs Ajoutés</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                <th className="pb-3">Nom</th>
                <th className="pb-3">Prénom</th>
                <th className="pb-3">Rôle</th>
                <th className="pb-3">Date d'ajout</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 text-slate-700 font-medium">{user.nom}</td>
                  <td className="py-3 text-slate-500">{user.prenom}</td>
                  <td className="py-3">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                      {user.role?.nom}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default Dashboard