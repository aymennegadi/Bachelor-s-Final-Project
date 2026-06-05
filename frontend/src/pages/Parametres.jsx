import { useState } from 'react'
import { useRole } from '/src/contexts/RoleContext'
import { User, Palette, Globe, Info, Lock, Eye, EyeOff } from 'lucide-react'

function Parametres() {
  const { role, nom, username, darkMode, setDarkMode, userId } = useRole()

  const [langue, setLangue] = useState("Français")

  const [passwords, setPasswords] = useState({
    ancien: '',
    nouveau: '',
    confirmer: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    ancien: false,
    nouveau: false,
    confirmer: false
  })
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: '' }
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    setMessage(null)

    if (!passwords.ancien || !passwords.nouveau || !passwords.confirmer) {
      return setMessage({ type: 'error', text: 'Tous les champs sont obligatoires' })
    }
    if (passwords.nouveau !== passwords.confirmer) {
      return setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' })
    }
    if (passwords.nouveau.length < 6) {
      return setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ancien_mot_de_passe: passwords.ancien,
          nouveau_mot_de_passe: passwords.nouveau
        })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' })
        setPasswords({ ancien: '', nouveau: '', confirmer: '' })
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' })
    }
    setLoading(false)
  }

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm pr-10 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-slate-700 placeholder-gray-400'
  }`

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Informations du compte */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          <User size={20} />
          Informations du compte
        </h2>
        <div className="space-y-3">
          <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Nom complet</span>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>{nom}</span>
          </div>
          <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Nom d'utilisateur</span>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>{username}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Rôle</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">{role}</span>
          </div>
        </div>
      </div>

      {/* Modifier mot de passe */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          <Lock size={20} />
          Modifier le mot de passe
        </h2>
        <div className="space-y-4">

          {/* Ancien mot de passe */}
          <div>
            <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Ancien mot de passe</label>
            <div className="relative">
              <input
                type={showPasswords.ancien ? 'text' : 'password'}
                value={passwords.ancien}
                onChange={e => setPasswords({ ...passwords, ancien: e.target.value })}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, ancien: !showPasswords.ancien })}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showPasswords.ancien ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPasswords.nouveau ? 'text' : 'password'}
                value={passwords.nouveau}
                onChange={e => setPasswords({ ...passwords, nouveau: e.target.value })}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, nouveau: !showPasswords.nouveau })}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showPasswords.nouveau ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPasswords.confirmer ? 'text' : 'password'}
                value={passwords.confirmer}
                onChange={e => setPasswords({ ...passwords, confirmer: e.target.value })}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirmer: !showPasswords.confirmer })}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showPasswords.confirmer ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-sm px-4 py-2 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Bouton */}
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>

        </div>
      </div>

      {/* Apparence */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          <Palette size={20} />
          Apparence
        </h2>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Mode sombre</span>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition duration-200 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </div>

      {/* Langue */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          <Globe size={20} />
          Langue
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setLangue("Français")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${langue === "Français" ? 'bg-slate-800 text-white' : 'border border-gray-300 text-slate-500 hover:bg-gray-50'}`}>
            Français
          </button>
          <button
            onClick={() => setLangue("Anglais")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${langue === "Anglais" ? 'bg-slate-800 text-white' : 'border border-gray-300 text-slate-500 hover:bg-gray-50'}`}>
            Anglais
          </button>
        </div>
      </div>

      {/* À propos */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          <Info size={20} />
          À propos de l'application
        </h2>
        <div className="space-y-2 text-sm">
          <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}><span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Application :</span> GestActifs</p>
          <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}><span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Version :</span> 1.0.0</p>
          <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}><span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Université :</span> Université Oran 1</p>
          <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}><span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Description :</span> Système de gestion de l'inventaire et des équipements de l'établissement universitaire.</p>
          <p className="pt-2 text-xs text-gray-400">© 2026 Université Oran 1 — Tous droits réservés.</p>
        </div>
      </div>

    </div>
  )
}
export default Parametres