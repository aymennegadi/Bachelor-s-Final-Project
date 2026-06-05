import { useEffect, useMemo, useState } from 'react'
import { useRole } from '../contexts/RoleContext'
import {
  createDemandeEquipement,
  getEquipementsDisponibles,
  getHistorique
} from '../services/professorService'

function DemanderEquipement() {
  const { nom, userId } = useRole()
  const [showModal, setShowModal] = useState(false)
  const [demandes, setDemandes] = useState([])
  const [equipementsDisponibles, setEquipementsDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [newDemande, setNewDemande] = useState({
    equipement_id: '',
    type: 'EMPRUNT',
    quantite: 1,
    justification: ''
  })

  const loadData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const [equipements, historique] = await Promise.all([
        getEquipementsDisponibles(),
        getHistorique(userId)
      ])
      setEquipementsDisponibles(equipements)
      setDemandes((historique?.demandes || []).filter(d => d.type === 'EMPRUNT').map((demande) => ({
        id: demande.id,
        equipement: demande.equipement?.designation || '—',
        type: demande.type,
        quantite: 1,
        date: new Date(demande.date_demande).toLocaleDateString('fr-FR'),
        statut: demande.statut,
        demandeur: `${nom || ''}`.trim()
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [userId])

  const handleAdd = async () => {
    if (!newDemande.equipement_id || !newDemande.justification.trim() || !userId) return
    try {
      setSubmitting(true)
      await createDemandeEquipement({
        equipement_id: parseInt(newDemande.equipement_id),
        motif: newDemande.justification,
        demandeur_id: userId
      })
      setShowModal(false)
      setNewDemande({
        equipement_id: '',
        type: 'EMPRUNT',
        quantite: 1,
        justification: ''
      })
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const counts = useMemo(() => ({
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'EN_ATTENTE').length,
    validees: demandes.filter(d => d.statut === 'VALIDEE').length
  }), [demandes])

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Chargement...</div>
  }
  if (error) {
    return <div className="py-10 text-center text-red-500">Erreur : {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Demander un Équipement</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Nouvelle Demande
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{counts.total}</p>
              <p className="text-sm text-slate-400">Total Demandes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{counts.enAttente}</p>
              <p className="text-sm text-slate-400">En Attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{counts.validees}</p>
              <p className="text-sm text-slate-400">Validées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des demandes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Équipement</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Quantité</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{d.equipement}</td>
                <td className="py-3 text-slate-500">{d.type}</td>
                <td className="py-3 text-slate-500">{d.quantite}</td>
                <td className="py-3 text-slate-500">{d.date}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.statut === "Validée" ? "bg-green-100 text-green-600" :
                    d.statut === "Refusée" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>{d.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nouvelle demande */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-700 mb-6">Nouvelle Demande d'Équipement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
                <select 
                  value={newDemande.equipement_id}
                  onChange={(e) => setNewDemande({ ...newDemande, equipement_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner un équipement</option>
                  {equipementsDisponibles.map((equip) => (
                    <option key={equip.id} value={equip.id}>
                      {equip.designation} ({equip.reference})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de demande</label>
                <select 
                  value={newDemande.type}
                  onChange={(e) => setNewDemande({ ...newDemande, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="EMPRUNT">Emprunt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input 
                  type="number" 
                  min="1" 
                  value={newDemande.quantite}
                  onChange={(e) => setNewDemande({ ...newDemande, quantite: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                <input 
                  type="date" 
                  value={newDemande.date}
                  onChange={(e) => setNewDemande({ ...newDemande, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                <textarea 
                  value={newDemande.justification}
                  onChange={(e) => setNewDemande({ ...newDemande, justification: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Expliquez pourquoi vous avez besoin de cet équipement..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50">
                {submitting ? 'Envoi...' : 'Envoyer la Demande'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemanderEquipement
