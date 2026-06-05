import { useEffect, useMemo, useState } from 'react'
import { useRole } from '../contexts/RoleContext'
import {
  createDemandeLaboratoire,
  getHistorique,
  getLaboratoires
} from '../services/professorService'

function DemanderSalle() {
  const { nom, userId } = useRole()
  const [showModal, setShowModal] = useState(false)
  const [demandes, setDemandes] = useState([])
  const [laboratoires, setLaboratoires] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [newDemande, setNewDemande] = useState({
    laboratoire_id: '',
    date: '',
    heure: '',
    duree: '1h',
    motif: '',
    nombreEtudiants: 20
  })

  const loadData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const [labs, historique] = await Promise.all([
        getLaboratoires(),
        getHistorique(userId)
      ])
      setLaboratoires(labs)
      setDemandes((historique?.demandes || [])
        .filter((demande) => demande.type === 'LABORATOIRE')
        .map((demande) => ({
          id: demande.id,
          salle: demande.laboratoire?.nom || '—',
          date: demande.date_demande ? new Date(demande.date_demande).toLocaleDateString('fr-FR') : '—',
          heure: '—',
          duree: '—',
          motif: demande.motif || '—',
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
    if (!newDemande.laboratoire_id || !newDemande.motif.trim() || !userId) return
    try {
      setSubmitting(true)
      await createDemandeLaboratoire({
        laboratoire_id: parseInt(newDemande.laboratoire_id),
        motif: newDemande.motif,
        demandeur_id: userId
      })
      setShowModal(false)
      setNewDemande({
        laboratoire_id: '',
        date: '',
        heure: '',
        duree: '1h',
        motif: '',
        nombreEtudiants: 20
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
    validees: demandes.filter(d => d.statut === 'VALIDEE' || d.statut === 'AFFECTEE').length
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
        <h2 className="text-lg font-bold text-slate-700">Demander une Salle</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Nouvelle Demande
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
              <p className="text-sm text-slate-400">Validées / Affectées</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Salle</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Motif</th>
              <th className="pb-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{d.salle}</td>
                <td className="py-3 text-slate-500">{d.date}</td>
                <td className="py-3 text-slate-500">{d.motif}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.statut === 'VALIDEE' || d.statut === 'AFFECTEE' ? 'bg-green-100 text-green-600' :
                    d.statut === 'REFUSEE' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>{d.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-700 mb-6">Nouvelle Demande de Salle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                <select
                  value={newDemande.laboratoire_id}
                  onChange={(e) => setNewDemande({ ...newDemande, laboratoire_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner une salle</option>
                  {laboratoires.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.nom} ({lab.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDemande.date}
                  onChange={(e) => setNewDemande({ ...newDemande, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  value={newDemande.heure}
                  onChange={(e) => setNewDemande({ ...newDemande, heure: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                <select
                  value={newDemande.duree}
                  onChange={(e) => setNewDemande({ ...newDemande, duree: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="1h">1 heure</option>
                  <option value="2h">2 heures</option>
                  <option value="3h">3 heures</option>
                  <option value="4h">4 heures</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'étudiants</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newDemande.nombreEtudiants}
                  onChange={(e) => setNewDemande({ ...newDemande, nombreEtudiants: parseInt(e.target.value) || 20 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <textarea
                  value={newDemande.motif}
                  onChange={(e) => setNewDemande({ ...newDemande, motif: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="TP, Examen, Cours, Séminaire..." />
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

export default DemanderSalle
