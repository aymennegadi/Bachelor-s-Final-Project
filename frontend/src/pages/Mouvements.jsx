import { useRole } from '../contexts/RoleContext'
import { useState, useEffect } from 'react'
import { getMouvements, createMouvement, updateMouvement, deleteMouvement } from '../services/magasinierService'
import { getEquipements, getLaboratoires } from '../services/adminService'

function Mouvements() {
  const { userId } = useRole()
  const [mouvements, setMouvements] = useState([])
  const [equipements, setEquipements] = useState([])
  const [laboratoires, setLaboratoires] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedMouvement, setSelectedMouvement] = useState(null)
  const [mouvementToDelete, setMouvementToDelete] = useState(null)
  const [newMouvement, setNewMouvement] = useState({ type: "ENTREE", quantite: "", equipement_id: "", laboratoire_id: "", motif: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [mouvs, equips, labs] = await Promise.all([getMouvements(), getEquipements(), getLaboratoires()])
      setMouvements(mouvs)
      setEquipements(equips)
      setLaboratoires(labs)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (mouvement) => {
    setSelectedMouvement(mouvement)
    setNewMouvement({
      type: mouvement.type,
      quantite: mouvement.quantite,
      equipement_id: mouvement.equipement_id,
      laboratoire_id: mouvement.laboratoire_id || "",
      motif: mouvement.motif || ""
    })
    setShowModal(true)
  }

  const handleAdd = async () => {
    try {
      console.log("userId:", userId)
      const data = { ...newMouvement, quantite: parseInt(newMouvement.quantite), equipement_id: parseInt(newMouvement.equipement_id), laboratoire_id: newMouvement.laboratoire_id ? parseInt(newMouvement.laboratoire_id) : null, magasinier_id: userId }
      console.log("data envoyée:", data)
      const created = await createMouvement(data)
      console.log("created:", created)
      setMouvements([...mouvements, created])
      setShowModal(false)
      setNewMouvement({ type: "ENTREE", quantite: "", equipement_id: "", laboratoire_id: "", motif: "" })
    } catch (error) {
      console.error("Erreur ajout:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      const data = { ...newMouvement, quantite: parseInt(newMouvement.quantite), laboratoire_id: newMouvement.laboratoire_id ? parseInt(newMouvement.laboratoire_id) : null }
      const updated = await updateMouvement(selectedMouvement.id, data)
      setMouvements(mouvements.map((m) => m.id === selectedMouvement.id ? updated : m))
      setShowModal(false)
      setSelectedMouvement(null)
      setNewMouvement({ type: "ENTREE", quantite: "", equipement_id: "", laboratoire_id: "", motif: "" })
    } catch (error) {
      console.error("Erreur modification:", error)
    }
  }

  const openDeleteConfirm = (mouvement) => {
    setMouvementToDelete(mouvement)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteMouvement(id)
      setMouvements(mouvements.filter((m) => m.id !== id))
      setShowDeleteConfirm(false)
      setMouvementToDelete(null)
    } catch (error) {
      console.error("Erreur suppression:", error)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Entrées / Sorties</h2>
        <button
          onClick={() => { setSelectedMouvement(null); setShowModal(true) }}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Nouveau Mouvement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Équipement</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Quantité</th>
              <th className="pb-3">Laboratoire</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{m.equipement?.designation || "N/A"}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.type === "ENTREE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {m.type === "ENTREE" ? "Entrée" : m.type === "SORTIE" ? "Sortie" : "Transfert"}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{m.quantite}</td>
                <td className="py-3 text-slate-500">{m.laboratoire?.nom || "-"}</td>
                <td className="py-3 text-slate-500">{new Date(m.date_mouvement).toLocaleDateString('fr-FR')}</td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                    Modifier
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(m)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">

            <h2 className="text-lg font-bold text-slate-700 mb-6">
              {selectedMouvement ? "Modifier Mouvement" : "Nouveau Mouvement"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
                <select value={newMouvement.equipement_id}
                  onChange={(e) => setNewMouvement({ ...newMouvement, equipement_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner un équipement</option>
                  {equipements.map((e) => (
                    <option key={e.id} value={e.id}>{e.designation} ({e.reference})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={newMouvement.type}
                  onChange={(e) => setNewMouvement({ ...newMouvement, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="ENTREE">Entrée</option>
                  <option value="SORTIE">Sortie</option>
                  <option value="TRANSFERT">Transfert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input type="number" value={newMouvement.quantite}
                  onChange={(e) => setNewMouvement({ ...newMouvement, quantite: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratoire (optionnel)</label>
                <select value={newMouvement.laboratoire_id}
                  onChange={(e) => setNewMouvement({ ...newMouvement, laboratoire_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner un laboratoire</option>
                  {laboratoires.map((l) => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif (optionnel)</label>
                <input type="text" value={newMouvement.motif}
                  onChange={(e) => setNewMouvement({ ...newMouvement, motif: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Raison du mouvement" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setSelectedMouvement(null); setNewMouvement({ type: "ENTREE", quantite: "", equipement_id: "", laboratoire_id: "", motif: "" }) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={selectedMouvement ? handleUpdate : handleAdd}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                {selectedMouvement ? "Modifier" : "Enregistrer"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteConfirm && mouvementToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Confirmer la suppression</h2>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce mouvement ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setMouvementToDelete(null)
                }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(mouvementToDelete.id)}
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
export default Mouvements