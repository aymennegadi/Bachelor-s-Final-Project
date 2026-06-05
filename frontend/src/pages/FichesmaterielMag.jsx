import { useState, useEffect } from 'react'
import { getEquipements, updateEquipement, deleteEquipement } from '../services/magasinierService'
import { getLaboratoires } from '../services/adminService'

const ETATS = ['NEUF', 'BON_ETAT', 'EN_PANNE', 'EN_MAINTENANCE', 'REFORME']

const ETAT_LABELS = {
  NEUF: 'Neuf',
  BON_ETAT: 'Bon état',
  EN_PANNE: 'En panne',
  EN_MAINTENANCE: 'En maintenance',
  REFORME: 'Réformé'
}

const etatBadge = (etat) => {
  const colors = {
    NEUF: 'bg-green-100 text-green-600',
    BON_ETAT: 'bg-blue-100 text-blue-600',
    EN_PANNE: 'bg-red-100 text-red-600',
    EN_MAINTENANCE: 'bg-yellow-100 text-yellow-600',
    REFORME: 'bg-gray-100 text-gray-500'
  }
  return colors[etat] || 'bg-gray-100 text-gray-500'
}

const emptyForm = {
  designation: '', reference: '', categorie: '',
  quantite: '', etat: 'NEUF', prix: '', localisation: '', laboratoire_id: ''
}

function FichesMateriel() {
  const [equipements, setEquipements] = useState([])
  const [laboratoires, setLaboratoires] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedEquip, setSelectedEquip] = useState(null)
  const [equipToDelete, setEquipToDelete] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [eqs, labs] = await Promise.all([getEquipements(), getLaboratoires()])
      setEquipements(eqs)
      setLaboratoires(labs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (equip) => {
    setSelectedEquip(equip)
    setForm({
      designation: equip.designation,
      reference: equip.reference,
      categorie: equip.categorie,
      quantite: equip.quantite,
      etat: equip.etat,
      prix: equip.prix ?? '',
      localisation: equip.localisation ?? '',
      laboratoire_id: equip.laboratoire_id ?? ''
    })
    setShowModal(true)
  }

  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        quantite: parseInt(form.quantite),
        prix: form.prix ? parseFloat(form.prix) : null,
        laboratoire_id: form.laboratoire_id ? parseInt(form.laboratoire_id) : null
      }
      const updated = await updateEquipement(selectedEquip.id, payload)
      setEquipements(equipements.map(e => e.id === selectedEquip.id ? updated : e))
      setShowModal(false)
      setSelectedEquip(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEquipement(equipToDelete.id)
      setEquipements(equipements.filter(e => e.id !== equipToDelete.id))
      setShowDeleteConfirm(false)
      setEquipToDelete(null)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Fiches Matériel</h2>
        <span className="text-sm text-slate-400">{equipements.length} équipement(s)</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Désignation</th>
              <th className="pb-3">Référence</th>
              <th className="pb-3">Catégorie</th>
              <th className="pb-3">Qté</th>
              <th className="pb-3">État</th>
              <th className="pb-3">Prix (DA)</th>
              <th className="pb-3">Laboratoire</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipements.map((equip) => (
              <tr key={equip.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{equip.designation}</td>
                <td className="py-3 text-slate-500">{equip.reference}</td>
                <td className="py-3 text-slate-500">{equip.categorie}</td>
                <td className="py-3 text-slate-500">{equip.quantite}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${etatBadge(equip.etat)}`}>
                    {ETAT_LABELS[equip.etat] ?? equip.etat}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{equip.prix ? `${equip.prix} DA` : '—'}</td>
                <td className="py-3 text-slate-500">{equip.laboratoire?.nom ?? '—'}</td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(equip)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                    Modifier
                  </button>
                  <button
                    onClick={() => { setEquipToDelete(equip); setShowDeleteConfirm(true) }}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-700 mb-6">Modifier Équipement</h2>
            <div className="space-y-4">
              {[
                { label: 'Désignation', key: 'designation', type: 'text' },
                { label: 'Référence', key: 'reference', type: 'text' },
                { label: 'Catégorie', key: 'categorie', type: 'text' },
                { label: 'Quantité', key: 'quantite', type: 'number' },
                { label: 'Prix (DA)', key: 'prix', type: 'number' },
                { label: 'Localisation', key: 'localisation', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                <select value={form.etat}
                  onChange={(e) => setForm({ ...form, etat: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  {ETATS.map(e => <option key={e} value={e}>{ETAT_LABELS[e]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratoire</label>
                <select value={form.laboratoire_id}
                  onChange={(e) => setForm({ ...form, laboratoire_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">— Aucun —</option>
                  {laboratoires.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} ({l.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setSelectedEquip(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Suppression */}
      {showDeleteConfirm && equipToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Confirmer la suppression</h2>
            <p className="text-slate-600 mb-6">
              Supprimer <span className="font-semibold">{equipToDelete.designation}</span> ({equipToDelete.reference}) ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setEquipToDelete(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default FichesMateriel