import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getSuiviMateriel } from '../services/logistiqueService'

const TYPE_CONFIG = {
  ENTREE:    { label: 'Entrée',    color: 'bg-green-100 text-green-800' },
  SORTIE:    { label: 'Sortie',    color: 'bg-red-100 text-red-800' },
  TRANSFERT: { label: 'Transfert', color: 'bg-blue-100 text-blue-800' }
}

export default function SuiviMateriel() {
  const { darkMode } = useContext(RoleContext)
  const [mouvements, setMouvements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filtreType, setFiltreType] = useState('TOUS')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const data = await getSuiviMateriel()
        setMouvements(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const filtered = mouvements.filter(m => {
    const matchSearch =
      (m.equipement?.designation || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.magasinier?.nom || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.laboratoire?.nom || '').toLowerCase().includes(search.toLowerCase())
    const matchType = filtreType === 'TOUS' || m.type === filtreType
    return matchSearch && matchType
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
          placeholder="Rechercher équipement, magasinier, labo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`flex-1 min-w-48 px-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300'}`}
        />
        <select
          value={filtreType}
          onChange={e => setFiltreType(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm outline-none
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
        >
          <option value="TOUS">Tous les types</option>
          <option value="ENTREE">Entrée</option>
          <option value="SORTIE">Sortie</option>
          <option value="TRANSFERT">Transfert</option>
        </select>
      </div>

      {/* Tableau */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Équipement</th>
              <th className="px-4 py-3 text-left">Qté</th>
              <th className="px-4 py-3 text-left">Laboratoire</th>
              <th className="px-4 py-3 text-left">Magasinier</th>
              <th className="px-4 py-3 text-left">Motif</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Aucun mouvement trouvé</td></tr>
            ) : filtered.map((m, i) => (
              <tr key={m.id} className={`border-t transition-colors
                ${darkMode
                  ? `border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : ''} hover:bg-slate-700`
                  : `border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50`}`}>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(m.date_mouvement).toLocaleDateString('fr-DZ')}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_CONFIG[m.type]?.color}`}>
                    {TYPE_CONFIG[m.type]?.label}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{m.equipement?.designation || '—'}</td>
                <td className="px-4 py-3">{m.quantite}</td>
                <td className="px-4 py-3 text-slate-500">{m.laboratoire?.nom || '—'}</td>
                <td className="px-4 py-3 text-slate-500">
                  {m.magasinier ? `${m.magasinier.prenom} ${m.magasinier.nom}` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{m.motif || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">{filtered.length} mouvement(s) affiché(s)</p>
    </div>
  )
}