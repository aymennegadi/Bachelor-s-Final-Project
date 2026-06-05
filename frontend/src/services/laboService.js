const BASE_URL = 'http://localhost:5000/api/labo'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

// ===== EQUIPEMENTS =====

export const getEquipementsLabo = async (userId) => {
  const res = await fetch(`${BASE_URL}/equipements/${userId}`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Erreur lors du chargement des équipements')
  return res.json()
}

// ===== DISPONIBILITE =====

export const getDisponibiliteLabo = async (userId) => {
  const res = await fetch(`${BASE_URL}/disponibilite/${userId}`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Erreur lors du chargement de la disponibilité')
  return res.json()
}

// ===== DEMANDES =====

export const getDemandes = async (userId) => {
  const res = await fetch(`${BASE_URL}/demandes/${userId}`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Erreur lors du chargement des demandes')
  return res.json()
}

export const createDemande = async (data) => {
  const res = await fetch(`${BASE_URL}/demandes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur lors de la création de la demande')
  return res.json()
}

export const getDashboardLabo = async (userId) => {
  const res = await fetch(`${BASE_URL}/dashboard/${userId}`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur dashboard labo')
  return res.json()
}

// ===== DEMANDES LABORATOIRE =====

export const getDemandesLaboratoire = async (userId) => {
  const res = await fetch(`${BASE_URL}/demandes-labo/${userId}`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur demandes laboratoire')
  return res.json()
}

export const traiterDemandeLaboratoire = async (id, data) => {
  const res = await fetch(`${BASE_URL}/demandes-labo/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur traiter demande laboratoire')
  return res.json()
}

// ===== SIGNALEMENTS =====

export const getSignalementsLabo = async (userId) => {
  const res = await fetch(`${BASE_URL}/signalements/${userId}`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur signalements')
  return res.json()
}