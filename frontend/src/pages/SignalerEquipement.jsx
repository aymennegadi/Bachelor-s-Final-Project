import { useEffect, useMemo, useState } from 'react'
import { useRole } from '../contexts/RoleContext'
import {
  createSignalement,
  getEquipementsPourSignalement,
  getHistorique
} from '../services/professorService'

function SignalerEquipement() {
  const { nom, userId } = useRole()
  const [showModal, setShowModal] = useState(false)
  const [signalements, setSignalements] = useState([])
  const [equipements, setEquipements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [newSignalement, setNewSignalement] = useState({
    equipement_id: '',
    typeProbleme: 'Panne',
    description: '',
    urgence: 'Moyenne'
  })

  const loadData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const [equipementsData, historique] = await Promise.all([
        getEquipementsPourSignalement(),
        getHistorique(userId)
      ])
      setEquipements(equipementsData)
      setSignalements((historique?.signalements || []).map((signalement) => ({
        id: signalement.id,
        equipement: signalement.equipement?.designation || '—',
        reference: signalement.equipement?.reference || '—',
        typeProbleme: signalement.description?.split(' - ')[0] || 'Panne',
        description: signalement.description || '—',
        date: new Date(signalement.date).toLocaleDateString('fr-FR'),
        statut: signalement.statut,
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
    if (!newSignalement.equipement_id || !newSignalement.description.trim() || !userId) return
    try {
      setSubmitting(true)
      await createSignalement({
        equipement_id: parseInt(newSignalement.equipement_id),
        description: `${newSignalement.typeProbleme} - ${newSignalement.description}`,
        professeur_id: userId
      })
      setShowModal(false)
      setNewSignalement({
        equipement_id: '',
        typeProbleme: 'Panne',
        description: '',
        urgence: 'Moyenne'
      })
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const counts = useMemo(() => ({
    total: signalements.length,
    enAttente: signalements.filter(s => s.statut === 'EN_ATTENTE').length,
    enCours: signalements.filter(s => s.statut === 'EN_COURS').length,
    resolus: signalements.filter(s => s.statut === 'RESOLU').length
  }), [signalements])

  const typesProblemes = [
    'Panne',
    'Mauvaise qualité',
    'Équipement corrompu',
    'Problème de performance',
    'Accessoire manquant',
    'Autre'
  ]

  const niveauxUrgence = {
    Faible: { color: 'bg-green-100 text-green-600' },
    Moyenne: { color: 'bg-yellow-100 text-yellow-600' },
    Haute: { color: 'bg-red-100 text-red-600' },
    Critique: { color: 'bg-purple-100 text-purple-600' }
  }

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Chargement...</div>
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">Erreur : {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Signaler un Équipement</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Nouveau Signalement
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{counts.total}</p>
              <p className="text-sm text-slate-400">Total Signalements</p>
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
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{counts.enCours}</p>
              <p className="text-sm text-slate-400">En Cours</p>
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
              <p className="text-2xl font-bold text-slate-700">{counts.resolus}</p>
              <p className="text-sm text-slate-400">Résolus</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Équipement</th>
              <th className="pb-3">Référence</th>
              <th className="pb-3">Type de problème</th>
              <th className="pb-3">Description</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {signalements.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{s.equipement}</td>
                <td className="py-3 text-slate-500">{s.reference}</td>
                <td className="py-3 text-slate-500">{s.typeProbleme}</td>
                <td className="py-3 text-slate-500 max-w-xs truncate" title={s.description}>
                  {s.description}
                </td>
                <td className="py-3 text-slate-500">{s.date}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    s.statut === 'RESOLU' ? 'bg-green-100 text-green-600' :
                    s.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>{s.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-700 mb-6">Nouveau Signalement d'Équipement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
                <select
                  value={newSignalement.equipement_id}
                  onChange={(e) => setNewSignalement({ ...newSignalement, equipement_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner un équipement</option>
                  {equipements.map((equip) => (
                    <option key={equip.id} value={equip.id}>
                      {equip.designation} ({equip.reference})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de problème</label>
                <select
                  value={newSignalement.typeProbleme}
                  onChange={(e) => setNewSignalement({ ...newSignalement, typeProbleme: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  {typesProblemes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'urgence</label>
                <select
                  value={newSignalement.urgence}
                  onChange={(e) => setNewSignalement({ ...newSignalement, urgence: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  {Object.keys(niveauxUrgence).map((niveau) => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
                <textarea
                  value={newSignalement.description}
                  onChange={(e) => setNewSignalement({ ...newSignalement, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  rows="4"
                  placeholder="Décrivez en détail le problème rencontré..."
                  required
                />
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Soyez aussi précis que possible dans la description pour aider l'équipe technique à résoudre rapidement le problème.
                </p>
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
                {submitting ? 'Envoi...' : 'Envoyer le Signalement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignalerEquipement
