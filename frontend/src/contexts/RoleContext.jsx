import { createContext, useState, useContext, useEffect } from "react";

export const RoleContext = createContext({
  role: "",
  setRole: () => {},
  nom: "",
  prenom: "",
  username: "",
  email: "",
  userId: null,
  darkMode: false,
  setDarkMode: () => {},
})

export default function RoleProvider({ children }) {
  const [role, setRoleState] = useState("")
  const [userId, setUserIdState] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [userInfo, setUserInfo] = useState({ nom: "", prenom: "", username: "", email: "" })

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole")
    const savedUserId = localStorage.getItem("userId")
    if (savedRole) setRoleState(savedRole)
    if (savedUserId) setUserIdState(parseInt(savedUserId))
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserInfo()
    }
  }, [userId])

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setUserInfo({
          nom: data.nom,
          prenom: data.prenom,
          username: data.username,
          email: data.email
        })
      }
    } catch (error) {
      console.error("Erreur fetchUserInfo:", error)
    }
  }

  const setRole = (newRole) => {
    setRoleState(newRole)
    localStorage.setItem("userRole", newRole)
  }

  const setUserId = (id) => {
    setUserIdState(id)
    localStorage.setItem("userId", id)
  }

  const nomComplet = `${userInfo.prenom} ${userInfo.nom}`.trim()

  return (
    <RoleContext.Provider value={{
      role, setRole,
      nom: nomComplet,
      prenom: userInfo.prenom,
      username: userInfo.username,
      email: userInfo.email,
      userId, setUserId,
      darkMode, setDarkMode
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)