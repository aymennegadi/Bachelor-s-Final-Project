import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getEquipementsLabo } from '../services/laboService'

const ETAT_COLORS = {
  NEUF: 'bg-blue-100 text-blue-800',
  BON_ETAT: 'bg-green-100 text-green-800',
  EN_PANNE: 'bg-red-100 text-red-800',
  EN_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  REFORME: 'bg-gray-100 text-gray-800'
}

const ETAT_LABELS = {
  NEUF: 'Neuf',
  BON_ETAT: 'Bon état',
  EN_PANNE: 'En panne',
  EN_MAINTENANCE: 'En maintenance',
  REFORME: 'Réformé'
}

export default function MesEquipements() {
  const { userId, darkMode } = useContext(RoleContext)
  const [equipements, setEquipements] = useState([])
  const [laboratoire, setLaboratoire] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getEquipementsLabo(userId)
        setLaboratoire(data.laboratoire)
        setEquipements(data.equipements)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchData()
  }, [userId])

  const filtered = equipements.filter(e =>
    e.designation.toLowerCase().includes(search.toLowerCase()) ||
    e.reference.toLowerCase().includes(search.toLowerCase()) ||
    e.categorie.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
    </div>
  )

  if (error) return (
    <div className="p-6 text-red-500">Erreur : {error}</div>
  )

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
      {/* En-tête labo */}
      {laboratoire && (
        <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-sm text-slate-500">Laboratoire assigné</p>
          <h2 className="text-lg font-semibold">{laboratoire.nom}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-blue-100 text-blue-700'}`}>
            Code : {laboratoire.code}
          </span>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par désignation, référence, catégorie..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-slate-800'}`}
        />
      </div>

      {/* Tableau */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <tr>
              <th className="px-4 py-3 text-left">Référence</th>
              <th className="px-4 py-3 text-left">Désignation</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Quantité</th>
              <th className="px-4 py-3 text-left">État</th>
              <th className="px-4 py-3 text-left">Localisation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Aucun équipement trouvé
                </td>
              </tr>
            ) : (
              filtered.map((eq, i) => (
                <tr
                  key={eq.id}
                  className={`border-t transition-colors
                    ${darkMode
                      ? `border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'} hover:bg-slate-700`
                      : `border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`
                    }`}
                >
                  <td className="px-4 py-3 font-mono text-xs">{eq.reference}</td>
                  <td className="px-4 py-3 font-medium">{eq.designation}</td>
                  <td className="px-4 py-3 text-slate-500">{eq.categorie}</td>
                  <td className="px-4 py-3">{eq.quantite}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ETAT_COLORS[eq.etat]}`}>
                      {ETAT_LABELS[eq.etat]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{eq.localisation || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400">{filtered.length} équipement(s) affiché(s)</p>
    </div>
  )
}