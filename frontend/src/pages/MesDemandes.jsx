import { useEffect, useState, useContext } from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getDemandes, createDemande, getEquipementsLabo } from "../services/laboService";

const TYPE_LABELS = {
  ACHAT: 'Achat',
  REMPLACEMENT: 'Remplacement',
  REFORME: 'Réforme',
  EQUIPEMENT: 'Équipement',
  SALLE: 'Salle',
  SIGNALEMENT: 'Signalement'
}

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  VALIDEE:    { label: 'Validée',    color: 'bg-green-100 text-green-800' },
  REFUSEE:    { label: 'Refusée',    color: 'bg-red-100 text-red-800' }
}

const FORM_INITIAL = { type: 'ACHAT', motif: '', equipement_id: '' }

export default function MesDemandes() {
  const { userId, darkMode } = useContext(RoleContext)
  const [demandes, setDemandes] = useState([])
  const [equipements, setEquipements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDemandes = async () => {
    const data = await getDemandes(userId)
    setDemandes(data)
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const [demandesData, equipData] = await Promise.all([
          getDemandes(userId),
          getEquipementsLabo(userId)
        ])
        setDemandes(demandesData)
        setEquipements(equipData.equipements || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (userId) init()
  }, [userId])

  const handleSubmit = async () => {
    if (!form.type) return
    try {
      setSubmitting(true)
      await createDemande({
        type: form.type,
        motif: form.motif,
        equipement_id: form.equipement_id || null,
        demandeur_id: userId
      })
      setSuccessMsg('Demande créée avec succès !')
      setForm(FORM_INITIAL)
      setShowForm(false)
      await fetchDemandes()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Types qui nécessitent un équipement lié
  const needsEquipement = ['REMPLACEMENT', 'REFORME', 'SIGNALEMENT']

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600"></div>
    </div>
  )

  if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>

      {/* Message succès */}
      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
          ✓ {successMsg}
        </div>
      )}

      {/* Bouton nouvelle demande */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Mes Demandes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouvelle demande'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className={`mb-6 p-5 rounded-xl border
          ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className="font-medium mb-4 text-sm">Nouvelle demande</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Type de demande *
              </label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value, equipement_id: '' })}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400
                  ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-800'}`}
              >
                {Object.entries(TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Équipement lié (si besoin) */}
            {needsEquipement.includes(form.type) && (
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Équipement concerné
                </label>
                <select
                  value={form.equipement_id}
                  onChange={e => setForm({ ...form, equipement_id: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400
                    ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-800'}`}
                >
                  <option value="">— Sélectionner —</option>
                  {equipements.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.designation} ({eq.reference})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Motif */}
            <div className="md:col-span-2">
              <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Motif / Description
              </label>
              <textarea
                value={form.motif}
                onChange={e => setForm({ ...form, motif: e.target.value })}
                rows={3}
                placeholder="Décrivez votre demande..."
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-slate-400 resize-none
                  ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-slate-800'}`}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => { setShowForm(false); setForm(FORM_INITIAL) }}
              className={`px-4 py-2 rounded-lg text-sm border
                ${darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-slate-600 hover:bg-gray-100'}`}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </div>
        </div>
      )}

      {/* Tableau des demandes */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Équipement</th>
              <th className="px-4 py-3 text-left">Motif</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Validé par</th>
            </tr>
          </thead>
          <tbody>
            {demandes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Aucune demande pour l'instant
                </td>
              </tr>
            ) : (
              demandes.map((d, i) => (
                <tr
                  key={d.id}
                  className={`border-t transition-colors
                    ${darkMode
                      ? `border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : ''} hover:bg-slate-700`
                      : `border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50`
                    }`}
                >
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(d.date_demande).toLocaleDateString('fr-DZ')}
                  </td>
                  <td className="px-4 py-3 font-medium">{TYPE_LABELS[d.type]}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {d.equipement ? `${d.equipement.designation}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{d.motif || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUT_CONFIG[d.statut]?.color}`}>
                      {STATUT_CONFIG[d.statut]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {d.valideur ? `${d.valideur.prenom} ${d.valideur.nom}` : '—'}
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