import { useState, useEffect } from 'react'
import { getUtilisateurs, createUtilisateur, updateUtilisateur, deleteUtilisateur, getRoles } from '../services/adminService'

function GestUsers() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({ nom: "", prenom: "", email: "", mot_de_passe: "", role_id: 2 })
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // ← NOUVEAU
  const [showResetModal, setShowResetModal] = useState(false)
  const [userToReset, setUserToReset] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetMessage, setResetMessage] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const data = await getRoles()
      setRoles(data)
    } catch (error) {
      console.error("Erreur roles:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUtilisateurs()
      setUsers(data)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUtilisateur(id)
      setUsers(users.filter((u) => u.id !== id))
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Erreur suppression:", error)
    }
  }

  const openDeleteConfirm = (user) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setNewUser({ nom: user.nom, prenom: user.prenom, email: user.email, mot_de_passe: "", role_id: user.role_id })
    setShowModal(true)
  }

  const handleAdd = async () => {
    try {
      const created = await createUtilisateur(newUser)
      setUsers([...users, created])
      setShowModal(false)
      setNewUser({ nom: "", prenom: "", email: "", mot_de_passe: "", role_id: 2 })
    } catch (error) {
      console.error("Erreur ajout:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      const updated = await updateUtilisateur(selectedUser.id, newUser)
      setUsers(users.map((u) => u.id === selectedUser.id ? updated : u))
      setShowModal(false)
      setSelectedUser(null)
      setNewUser({ nom: "", prenom: "", email: "", mot_de_passe: "", role_id: 2 })
    } catch (error) {
      console.error("Erreur modification:", error)
    }
  }

  // ← NOUVEAU
  const openResetModal = (user) => {
    setUserToReset(user)
    setNewPassword('')
    setResetMessage(null)
    setShowResetModal(true)
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setResetMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
    }
    setResetLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/admin/utilisateurs/${userToReset.id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nouveau_mot_de_passe: newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        setResetMessage({ type: 'success', text: 'Mot de passe réinitialisé avec succès' })
        setNewPassword('')
      } else {
        setResetMessage({ type: 'error', text: data.message })
      }
    } catch {
      setResetMessage({ type: 'error', text: 'Erreur de connexion au serveur' })
    }
    setResetLoading(false)
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Liste des Utilisateurs</h2>
        <button
          onClick={() => { setSelectedUser(null); setShowModal(true) }}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Ajouter Utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Nom</th>
              <th className="pb-3">Prénom</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Rôle</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{user.nom}</td>
                <td className="py-3 text-slate-500">{user.prenom}</td>
                <td className="py-3 text-slate-500">{user.email}</td>
                <td className="py-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    {user.role?.nom}
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                    Modifier
                  </button>
                  <button
                    onClick={() => openResetModal(user)}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition">
                    Réinitialiser MDP
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(user)}
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
              {selectedUser ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" value={newUser.prenom}
                  onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Prénom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="email@univ.dz" />
              </div>
              {!selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input type="password" value={newUser.mot_de_passe}
                    onChange={(e) => setNewUser({ ...newUser, mot_de_passe: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Mot de passe" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select value={newUser.role_id}
                  onChange={(e) => setNewUser({ ...newUser, role_id: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  {roles.filter(r => r.nom !== "ADMIN").map(r => (
                    <option key={r.id} value={r.id}>{r.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setSelectedUser(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={selectedUser ? handleUpdate : handleAdd}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                {selectedUser ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Réinitialiser MDP ← NOUVEAU */}
      {showResetModal && userToReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-2">Réinitialiser le mot de passe</h2>
            <p className="text-sm text-slate-500 mb-6">
              Utilisateur : <span className="font-semibold text-slate-700">{userToReset.nom} {userToReset.prenom}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Minimum 6 caractères" />
              </div>
              {resetMessage && (
                <div className={`text-sm px-4 py-2 rounded-lg ${resetMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {resetMessage.text}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowResetModal(false); setUserToReset(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Fermer
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50">
                {resetLoading ? 'Réinitialisation...' : 'Réinitialiser'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Confirmer la suppression</h2>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{userToDelete.nom} {userToDelete.prenom}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setUserToDelete(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(userToDelete.id)}
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
export default GestUsers