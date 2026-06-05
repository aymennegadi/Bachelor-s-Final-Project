const BASE_URL = 'http://localhost:5000/api/magasinier'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

// ===== EQUIPEMENTS =====

export const getEquipements = async () => {
  const res = await fetch(`${BASE_URL}/equipements`, { headers: headers() })
  return res.json()
}

export const createEquipement = async (data) => {
  const res = await fetch(`${BASE_URL}/equipements`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
  return res.json()
}

export const updateEquipement = async (id, data) => {
  const res = await fetch(`${BASE_URL}/equipements/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteEquipement = async (id) => {
  const res = await fetch(`${BASE_URL}/equipements/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  return res.json()
}

// ===== MOUVEMENTS =====

export const getMouvements = async () => {
  const res = await fetch(`${BASE_URL}/mouvements`, { headers: headers() })
  return res.json()
}

export const createMouvement = async (data) => {
  const res = await fetch(`${BASE_URL}/mouvements`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
  return res.json()
}

export const updateMouvement = async (id, data) => {
  const res = await fetch(`${BASE_URL}/mouvements/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteMouvement = async (id) => {
  const res = await fetch(`${BASE_URL}/mouvements/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  return res.json()
}

export const getDemandesValidees = async () => {
  const res = await fetch(`${BASE_URL}/demandes-validees`, { headers: headers() })
  if (!res.ok) throw new Error('Erreur demandes validées')
  return res.json()
}

export const marquerReceptionnee = async (id) => {
  const res = await fetch(`${BASE_URL}/demandes-validees/${id}/receptionner`, {
    method: 'PUT',
    headers: headers()
  })
  if (!res.ok) throw new Error('Erreur marquer réceptionnée')
  return res.json()
}

// ===== DEMANDES EMPRUNT =====

export const getDemandesEmprunt = async () => {
  const res = await fetch(`${BASE_URL}/demandes-emprunt`, { headers: headers() })
  if (!res.ok) throw new Error('Erreur demandes emprunt')
  return res.json()
}

export const traiterDemandeEmprunt = async (id, data) => {
  const res = await fetch(`${BASE_URL}/demandes-emprunt/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur traiter demande emprunt')
  return res.json()
}

// ===== SIGNALEMENTS =====

export const getSignalements = async () => {
  const res = await fetch(`${BASE_URL}/signalements`, { headers: headers() })
  if (!res.ok) throw new Error('Erreur signalements')
  return res.json()
}

export const traiterSignalement = async (id, data) => {
  const res = await fetch(`${BASE_URL}/signalements/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur traiter signalement')
  return res.json()
}