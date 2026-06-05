import { useState } from 'react'
import * as Icons from 'lucide-react'
import { PROF_STATS, PROF_EQUIPEMENTS_LIST, PROF_DEMANDES_LIST } from '../constants/cst'

function Professeur() {
  const [activeTab, setActiveTab] = useState('equipements')

  return (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-4 gap-6">
        {PROF_STATS.map((stat) => {
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

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-100">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('equipements')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'equipements'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Mes Équipements
            </button>
            <button
              onClick={() => setActiveTab('demandes')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'demandes'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Mes Demandes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Équipements */}
          {activeTab === 'equipements' && (
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-4">Mes Équipements</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                    <th className="pb-3">Nom</th>
                    <th className="pb-3">Référence</th>
                    <th className="pb-3">Quantité</th>
                    <th className="pb-3">État</th>
                    <th className="pb-3">Disponibilité</th>
                  </tr>
                </thead>
                <tbody>
                  {PROF_EQUIPEMENTS_LIST.map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 text-slate-700 font-medium">{e.nom}</td>
                      <td className="py-3 text-slate-500">{e.reference}</td>
                      <td className="py-3 text-slate-500">{e.quantite}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          e.etat === "Neuf" ? "bg-green-100 text-green-600" :
                          e.etat === "Bon état" ? "bg-blue-100 text-blue-600" :
                          e.etat === "Moyen" ? "bg-yellow-100 text-yellow-600" :
                          "bg-red-100 text-red-600"
                        }`}>{e.etat}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${e.disponible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {e.disponible ? "Disponible" : "Indisponible"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Onglet Demandes */}
          {activeTab === 'demandes' && (
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-4">Mes Demandes</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                    <th className="pb-3">Équipement</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {PROF_DEMANDES_LIST.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 text-slate-700 font-medium">{d.equipement}</td>
                      <td className="py-3 text-slate-500">{d.type}</td>
                      <td className="py-3 text-slate-500">{d.date}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          d.statut === "Validée" ? "bg-green-100 text-green-600" :
                          d.statut === "En attente" ? "bg-yellow-100 text-yellow-600" :
                          d.statut === "Refusée" ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>{d.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Professeur