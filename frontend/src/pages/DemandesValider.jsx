import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getDemandes, validerDemande } from '../services/logistiqueService'

const TYPE_LABELS = {
  ACHAT: 'Achat', REMPLACEMENT: 'Remplacement', REFORME: 'Réforme',
  EQUIPEMENT: 'Équipement', SALLE: 'Salle', SIGNALEMENT: 'Signalement'
}

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  VALIDEE:    { label: 'Validée',    color: 'bg-green-100 text-green-800' },
  REFUSEE:    { label: 'Refusée',    color: 'bg-red-100 text-red-800' }
}

export default function DemandesValider() {
  const { darkMode, userId } = useContext(RoleContext)
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtre, setFiltre] = useState('EN_ATTENTE')
  const [actionLoading, setActionLoading] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDemandes = async () => {
    try {
      const data = await getDemandes()
      setDemandes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDemandes() }, [])

  const handleAction = async (id, statut) => {
    try {
      setActionLoading(id)
      await validerDemande(id, statut, userId)
      setSuccessMsg(statut === 'VALIDEE' ? 'Demande validée ✓' : 'Demande refusée')
      await fetchDemandes()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = demandes.filter(d => filtre === 'TOUS' || d.statut === filtre)
  const countEnAttente = demandes.filter(d => d.statut === 'EN_ATTENTE').length

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
        <div className="mb-4 px-4 py-3 rounded-lg border text-sm flex items-center gap-2 bg-yellow-50 border-yellow-200 text-yellow-800">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <span><strong>{countEnAttente}</strong> demande(s) en attente de validation</span>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {[
          { val: 'EN_ATTENTE', label: 'En attente' },
          { val: 'VALIDEE',    label: 'Validées' },
          { val: 'REFUSEE',    label: 'Refusées' },
          { val: 'TOUS',       label: 'Toutes' },
        ].map(tab => (
          <button key={tab.val} onClick={() => setFiltre(tab.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filtre === tab.val ? 'bg-slate-800 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
            {tab.label}
            {tab.val !== 'TOUS' && (
              <span className="ml-2 text-xs opacity-70">
                ({demandes.filter(d => d.statut === tab.val).length})
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
              <th className="px-4 py-3 text-left">Demandeur</th>
              <th className="px-4 py-3 text-left">Rôle</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Équipement</th>
              <th className="px-4 py-3 text-left">Motif</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Aucune demande</td></tr>
            ) : filtered.map((d, i) => (
              <tr key={d.id} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50`}>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(d.date_demande).toLocaleDateString('fr-DZ')}</td>
                <td className="px-4 py-3 font-medium">{d.demandeur ? `${d.demandeur.prenom} ${d.demandeur.nom}` : '—'}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{d.demandeur?.role?.nom || '—'}</td>
                <td className="px-4 py-3">{TYPE_LABELS[d.type] || d.type}</td>
                <td className="px-4 py-3 text-slate-500">{d.equipement?.designation || '—'}</td>
                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{d.motif || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUT_CONFIG[d.statut]?.color}`}>
                    {STATUT_CONFIG[d.statut]?.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {d.statut === 'EN_ATTENTE' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(d.id, 'VALIDEE')} disabled={actionLoading === d.id}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {actionLoading === d.id ? '...' : 'Valider'}
                      </button>
                      <button onClick={() => handleAction(d.id, 'REFUSEE')} disabled={actionLoading === d.id}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {actionLoading === d.id ? '...' : 'Refuser'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      {d.valideur ? `par ${d.valideur.prenom} ${d.valideur.nom}` : '—'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">{filtered.length} demande(s) affichée(s)</p>
    </div>
  )
}