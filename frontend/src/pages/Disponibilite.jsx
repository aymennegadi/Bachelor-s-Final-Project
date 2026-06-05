import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getDisponibiliteLabo } from '../services/laboService'

const ETAT_CONFIG = {
  NEUF:           { label: 'Neuf',           color: 'bg-blue-100 text-blue-800',   bar: 'bg-blue-500' },
  BON_ETAT:       { label: 'Bon état',       color: 'bg-green-100 text-green-800', bar: 'bg-green-500' },
  EN_PANNE:       { label: 'En panne',       color: 'bg-red-100 text-red-800',     bar: 'bg-red-500' },
  EN_MAINTENANCE: { label: 'En maintenance', color: 'bg-yellow-100 text-yellow-800', bar: 'bg-yellow-500' },
  REFORME:        { label: 'Réformé',        color: 'bg-gray-100 text-gray-700',   bar: 'bg-gray-400' }
}

export default function Disponibilite() {
  const { userId, darkMode } = useContext(RoleContext)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getDisponibiliteLabo(userId)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchData()
  }, [userId])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
    </div>
  )

  if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>
  if (!data) return null

  const { stats, equipements } = data

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {Object.entries(ETAT_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            className={`rounded-xl p-4 text-center border
              ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
          >
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {stats[key] || 0}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {cfg.label}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full ${cfg.bar} transition-all duration-500`}
                style={{ width: stats.total > 0 ? `${((stats[key] || 0) / stats.total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className={`mb-6 px-4 py-3 rounded-lg border text-sm
        ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
        <span className="font-medium">{stats.total}</span> équipement(s) au total dans votre laboratoire
      </div>

      {/* Tableau détaillé */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <tr>
              <th className="px-4 py-3 text-left">Référence</th>
              <th className="px-4 py-3 text-left">Désignation</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Qté</th>
              <th className="px-4 py-3 text-left">Localisation</th>
              <th className="px-4 py-3 text-left">État</th>
            </tr>
          </thead>
          <tbody>
            {equipements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Aucun équipement dans ce laboratoire
                </td>
              </tr>
            ) : (
              equipements.map((eq, i) => (
                <tr
                  key={eq.id}
                  className={`border-t transition-colors
                    ${darkMode
                      ? `border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : ''} hover:bg-slate-700`
                      : `border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50`
                    }`}
                >
                  <td className="px-4 py-3 font-mono text-xs">{eq.reference}</td>
                  <td className="px-4 py-3 font-medium">{eq.designation}</td>
                  <td className="px-4 py-3 text-slate-500">{eq.categorie}</td>
                  <td className="px-4 py-3">{eq.quantite}</td>
                  <td className="px-4 py-3 text-slate-500">{eq.localisation || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ETAT_CONFIG[eq.etat]?.color}`}>
                      {ETAT_CONFIG[eq.etat]?.label}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}