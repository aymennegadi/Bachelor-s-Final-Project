import { useState, useEffect, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getDemandesLaboratoire, traiterDemandeLaboratoire, getSignalementsLabo } from '../services/laboService'

const TYPE_LABELS = {
  LABORATOIRE: 'Salle',
  EQUIPEMENT: 'Équipement'
}

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  AFFECTEE: { label: 'Affectée', color: 'bg-green-100 text-green-800' },
  REFUSEE: { label: 'Refusée', color: 'bg-red-100 text-red-800' }
}

export default function DemandesLaboratoire() {
  const { userId, darkMode } = useContext(RoleContext)
  const [demandes, setDemandes] = useState([])
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('demandes')

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      const [dem, sig] = await Promise.all([
        getDemandesLaboratoire(userId),
        getSignalementsLabo(userId)
      ])
      setDemandes(dem)
      setSignalements(sig)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTraiterDemande = async (id, statut) => {
    try {
      await traiterDemandeLaboratoire(id, { statut, valideur_id: userId })
      setDemandes(prev => prev.filter(d => d.id !== id))
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-100">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('demandes')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'demandes'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Demandes de Salle ({demandes.length})
            </button>
            <button
              onClick={() => setActiveTab('signalements')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'signalements'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Signalements ({signalements.length})
            </button>
          </nav>
        </div>

        {/* DEMANDES */}
        {activeTab === 'demandes' && (
          <div className="p-6">
            {demandes.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Aucune demande en attente</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Professeur</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Motif</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 hover:bg-blue-50 transition">
                        <td className="py-3 text-slate-400 text-xs">
                          {new Date(d.date_demande).toLocaleDateString('fr-DZ')}
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          {d.demandeur ? `${d.demandeur.prenom} ${d.demandeur.nom}` : '—'}
                        </td>
                        <td className="py-3">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {TYPE_LABELS[d.type] || d.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-xs truncate">{d.motif || '—'}</td>
                        <td className="py-3 flex gap-2">
                          <button
                            onClick={() => handleTraiterDemande(d.id, 'AFFECTEE')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition"
                          >
                            ✓ Accepter
                          </button>
                          <button
                            onClick={() => handleTraiterDemande(d.id, 'REFUSEE')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 transition"
                          >
                            ✗ Refuser
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SIGNALEMENTS */}
        {activeTab === 'signalements' && (
          <div className="p-6">
            {signalements.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Aucun signalement</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Professeur</th>
                      <th className="pb-3">Équipement</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signalements.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-orange-50 transition">
                        <td className="py-3 text-slate-400 text-xs">
                          {new Date(s.date).toLocaleDateString('fr-DZ')}
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          {s.professeur ? `${s.professeur.prenom} ${s.professeur.nom}` : '—'}
                        </td>
                        <td className="py-3 text-slate-500">{s.equipement?.designation || '—'}</td>
                        <td className="py-3 text-slate-500 max-w-xs truncate">{s.description || '—'}</td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              s.statut === 'EN_ATTENTE'
                                ? 'bg-yellow-100 text-yellow-700'
                                : s.statut === 'EN_COURS'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {s.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
