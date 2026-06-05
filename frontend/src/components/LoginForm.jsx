import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'
import { login } from '../services/authService'

function LoginForm() {
  const { setRole, setUserId } = useRole()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const res = await login(username, password)
    console.log("res complet:", res)
    console.log("res:", res)

    localStorage.setItem("token", res.token)
    
   const role = res.utilisateur?.role || res.role
   const payload = JSON.parse(atob(res.token.split('.')[1]))
    const id = payload.id
    setRole(role)
    setUserId(id)


    if (role === "ADMIN" || role === "admin") {
      navigate("/admin")
    } else {
      navigate("/users")
    }

  } catch (err) {
    console.log("error",err)
    setError("Email ou mot de passe incorrect")
  }
}

  return (
    <div className='h-full bg-gray-300 flex items-center justify-center'>
      <div className="bg-white rounded-2xl p-10 w-full max-w-md mt-6">
        
        <div className="text-center mb-8">
          <img
            src="/src/assets/LOGO_UNIV_ORAN_1_Anglais.png"
            alt="Logo Université Oran 1"
            className="w-82 h-22 object-contain mx-auto"/>
          <h1 className="text-2xl font-bold text-slate-700">
            Gestion des Actifs
          </h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-slate-800 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition duration-200">
          Se Connecter
        </button>

      </div>
    </div>
  )
}
export default LoginForm