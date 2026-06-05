import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getInventaire } from '../services/logistiqueService'

const ETAT_COLORS = {
  NEUF:           'bg-blue-100 text-blue-800',
  BON_ETAT:       'bg-green-100 text-green-800',
  EN_PANNE:       'bg-red-100 text-red-800',
  EN_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  REFORME:        'bg-gray-100 text-gray-700'
}

const ETAT_LABELS = {
  NEUF: 'Neuf', BON_ETAT: 'Bon état', EN_PANNE: 'En panne',
  EN_MAINTENANCE: 'En maintenance', REFORME: 'Réformé'
}

export default function Inventaire() {
  const { darkMode } = useContext(RoleContext)
  const [equipements, setEquipements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filtreEtat, setFiltreEtat] = useState('TOUS')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const data = await getInventaire()
        setEquipements(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const filtered = equipements.filter(e => {
    const matchSearch = e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase()) ||
      (e.laboratoire?.nom || '').toLowerCase().includes(search.toLowerCase())
    const matchEtat = filtreEtat === 'TOUS' || e.etat === filtreEtat
    return matchSearch && matchEtat
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
    </div>
  )
  if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`flex-1 min-w-48 px-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300'}`}
        />
        <select
          value={filtreEtat}
          onChange={e => setFiltreEtat(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm outline-none
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
        >
          <option value="TOUS">Tous les états</option>
          {Object.entries(ETAT_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <tr>
              <th className="px-4 py-3 text-left">Référence</th>
              <th className="px-4 py-3 text-left">Désignation</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Qté</th>
              <th className="px-4 py-3 text-left">Laboratoire</th>
              <th className="px-4 py-3 text-left">Localisation</th>
              <th className="px-4 py-3 text-left">État</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Aucun équipement trouvé</td></tr>
            ) : filtered.map((eq, i) => (
              <tr key={eq.id} className={`border-t transition-colors
                ${darkMode
                  ? `border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : ''} hover:bg-slate-700`
                  : `border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}`}>
                <td className="px-4 py-3 font-mono text-xs">{eq.reference}</td>
                <td className="px-4 py-3 font-medium">{eq.designation}</td>
                <td className="px-4 py-3 text-slate-500">{eq.categorie}</td>
                <td className="px-4 py-3">{eq.quantite}</td>
                <td className="px-4 py-3 text-slate-500">{eq.laboratoire?.nom || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{eq.localisation || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ETAT_COLORS[eq.etat]}`}>
                    {ETAT_LABELS[eq.etat]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">{filtered.length} équipement(s) affiché(s)</p>
    </div>
  )
}