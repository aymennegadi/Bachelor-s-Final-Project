import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getSignalements, traiterSignalement } from '../services/magasinierService'

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  EN_COURS: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  RESOLU: { label: 'Résolu', color: 'bg-green-100 text-green-800' }
}

export default function SignalementsMag() {
  const { darkMode } = useContext(RoleContext)
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtre, setFiltre] = useState('EN_ATTENTE')
  const [actionLoading, setActionLoading] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchSignalements = async () => {
    try {
      const data = await getSignalements()
      setSignalements(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSignalements() }, [])

  const handleAction = async (id, statut) => {
    try {
      setActionLoading(id)
      await traiterSignalement(id, { statut })
      setSuccessMsg(`Signalement marqué comme ${statut}`)
      await fetchSignalements()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = signalements.filter(s => filtre === 'TOUS' || s.statut === filtre)
  const countEnAttente = signalements.filter(s => s.statut === 'EN_ATTENTE').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
    </div>
  )
  if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>

      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
          {successMsg}
        </div>
      )}

      {countEnAttente > 0 && (
        <div className="mb-4 px-4 py-3 rounded-lg border text-sm flex items-center gap-2 bg-orange-50 border-orange-200 text-orange-800">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span><strong>{countEnAttente}</strong> signalement(s) en attente</span>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {[
          { val: 'EN_ATTENTE', label: 'En attente' },
          { val: 'EN_COURS', label: 'En cours' },
          { val: 'RESOLU', label: 'Résolus' },
          { val: 'TOUS', label: 'Tous' },
        ].map(tab => (
          <button key={tab.val} onClick={() => setFiltre(tab.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filtre === tab.val ? 'bg-slate-800 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
            {tab.label}
            {tab.val !== 'TOUS' && (
              <span className="ml-2 text-xs opacity-70">
                ({signalements.filter(s => s.statut === tab.val).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Professeur</th>
              <th className="px-4 py-3 text-left">Équipement</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Aucun signalement</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-orange-50`}>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(s.date).toLocaleDateString('fr-DZ')}</td>
                <td className="px-4 py-3 font-medium">{s.professeur ? `${s.professeur.prenom} ${s.professeur.nom}` : '—'}</td>
                <td className="px-4 py-3 text-slate-500">{s.equipement?.designation || '—'}</td>
                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{s.description || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUT_CONFIG[s.statut]?.color}`}>
                    {STATUT_CONFIG[s.statut]?.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.statut === 'EN_ATTENTE' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(s.id, 'EN_COURS')} disabled={actionLoading === s.id}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {actionLoading === s.id ? '...' : 'En cours'}
                      </button>
                      <button onClick={() => handleAction(s.id, 'RESOLU')} disabled={actionLoading === s.id}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {actionLoading === s.id ? '...' : 'Résolu'}
                      </button>
                    </div>
                  ) : s.statut === 'EN_COURS' ? (
                    <button onClick={() => handleAction(s.id, 'RESOLU')} disabled={actionLoading === s.id}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {actionLoading === s.id ? '...' : 'Résolu'}
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">✓ Résolu</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">{filtered.length} signalement(s) affiché(s)</p>
    </div>
  )
}
