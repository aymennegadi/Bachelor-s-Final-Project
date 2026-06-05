import axios from 'axios'

const apiUrl = "http://localhost:5000/api/admin"

const getToken = () => localStorage.getItem("token")

// ===== UTILISATEURS =====
export const getUtilisateurs = async () => {
  const res = await axios.get(`${apiUrl}/utilisateurs`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const createUtilisateur = async (data) => {
  const res = await axios.post(`${apiUrl}/utilisateurs`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const updateUtilisateur = async (id, data) => {
  const res = await axios.put(`${apiUrl}/utilisateurs/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const deleteUtilisateur = async (id) => {
  const res = await axios.delete(`${apiUrl}/utilisateurs/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

// ===== LABORATOIRES =====
export const getLaboratoires = async () => {
  const res = await axios.get(`${apiUrl}/laboratoires`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const createLaboratoire = async (data) => {
  const res = await axios.post(`${apiUrl}/laboratoires`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const updateLaboratoire = async (id, data) => {
  const res = await axios.put(`${apiUrl}/laboratoires/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const deleteLaboratoire = async (id) => {
  const res = await axios.delete(`${apiUrl}/laboratoires/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const getRoles = async () => {
  const res = await axios.get(`${apiUrl}/roles`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

// ===== EQUIPEMENTS =====
export const getEquipements = async () => {
  const res = await axios.get(`${apiUrl}/equipements`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const createEquipement = async (data) => {
  const res = await axios.post(`${apiUrl}/equipements`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const updateEquipement = async (id, data) => {
  const res = await axios.put(`${apiUrl}/equipements/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const deleteEquipement = async (id) => {
  const res = await axios.delete(`${apiUrl}/equipements/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

// ===== MOUVEMENTS =====
export const getMouvements = async () => {
  const res = await axios.get(`${apiUrl}/mouvements`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const createMouvement = async (data) => {
  const res = await axios.post(`${apiUrl}/mouvements`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const updateMouvement = async (id, data) => {
  const res = await axios.put(`${apiUrl}/mouvements/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const deleteMouvement = async (id) => {
  const res = await axios.delete(`${apiUrl}/mouvements/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}