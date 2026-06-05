import { useState, useEffect } from 'react'
import { getLaboratoires, createLaboratoire, updateLaboratoire, deleteLaboratoire } from '../services/adminService'

function GestLabo() {
  const [labs, setLabs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedLab, setSelectedLab] = useState(null)
  const [newLab, setNewLab] = useState({ nom: "", code: "", description: "", responsable_id: null })
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [labToDelete, setLabToDelete] = useState(null)

  useEffect(() => {
    fetchLabs()
  }, [])

  const fetchLabs = async () => {
    try {
      const data = await getLaboratoires()
      setLabs(data)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteLaboratoire(id)
      setLabs(labs.filter((l) => l.id !== id))
      setShowDeleteConfirm(false)
      setLabToDelete(null)
    } catch (error) {
      console.error("Erreur suppression:", error)
    }
  }

  const openDeleteConfirm = (lab) => {
    setLabToDelete(lab)
    setShowDeleteConfirm(true)
  }

  const handleEdit = (lab) => {
    setSelectedLab(lab)
    setNewLab({
      nom: lab.nom,
      code: lab.code,
      description: lab.description || "",
      responsable_id: lab.responsable_id
    })
    setShowModal(true)
  }

  const handleAdd = async () => {
    try {
      const created = await createLaboratoire(newLab)
      setLabs([...labs, created])
      setShowModal(false)
      setNewLab({ nom: "", code: "", description: "", responsable_id: null })
    } catch (error) {
      console.error("Erreur ajout:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      const updated = await updateLaboratoire(selectedLab.id, newLab)
      setLabs(labs.map((l) => l.id === selectedLab.id ? updated : l))
      setShowModal(false)
      setSelectedLab(null)
      setNewLab({ nom: "", code: "", description: "", responsable_id: null })
    } catch (error) {
      console.error("Erreur modification:", error)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Liste des Laboratoires</h2>
        <button
          onClick={() => { setSelectedLab(null); setShowModal(true) }}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Ajouter Laboratoire
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Nom</th>
              <th className="pb-3">Code</th>
              <th className="pb-3">Description</th>
              <th className="pb-3">Responsable</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{lab.nom}</td>
                <td className="py-3 text-slate-500">{lab.code}</td>
                <td className="py-3 text-slate-500">{lab.description || "-"}</td>
                <td className="py-3 text-slate-500">
                  {lab.responsable ? `${lab.responsable.nom} ${lab.responsable.prenom}` : "-"}
                </td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(lab)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                    Modifier
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(lab)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">

            <h2 className="text-lg font-bold text-slate-700 mb-6">
              {selectedLab ? "Modifier Laboratoire" : "Ajouter Laboratoire"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" value={newLab.nom}
                  onChange={(e) => setNewLab({ ...newLab, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Laboratoire Informatique" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input type="text" value={newLab.code}
                  onChange={(e) => setNewLab({ ...newLab, code: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: LAB-INFO-01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={newLab.description}
                  onChange={(e) => setNewLab({ ...newLab, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Description du laboratoire" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setSelectedLab(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={selectedLab ? handleUpdate : handleAdd}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                {selectedLab ? "Modifier" : "Ajouter"}
              </button>
            </div>

          </div>
        </div>
      )}

      {showDeleteConfirm && labToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Confirmer la suppression</h2>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le laboratoire <span className="font-semibold">{labToDelete.nom}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setLabToDelete(null)
                }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(labToDelete.id)}
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
export default GestLabo