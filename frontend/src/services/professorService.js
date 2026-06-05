const BASE_URL = 'http://localhost:5000/api/professor'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const handleResponse = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage)
  }
  return data
}

export const getEquipementsDisponibles = async () => {
  const res = await fetch(`${BASE_URL}/equipements`, {
    headers: getHeaders()
  })
  return handleResponse(res, 'Erreur lors du chargement des équipements')
}

export const createDemandeEquipement = async (data) => {
  const res = await fetch(`${BASE_URL}/demandes/equipement`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res, 'Erreur lors de la création de la demande équipement')
}

export const getLaboratoires = async () => {
  const res = await fetch(`${BASE_URL}/laboratoires`, {
    headers: getHeaders()
  })
  return handleResponse(res, 'Erreur lors du chargement des laboratoires')
}

export const createDemandeLaboratoire = async (data) => {
  const res = await fetch(`${BASE_URL}/demandes/laboratoire`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res, 'Erreur lors de la création de la demande salle')
}

export const getEquipementsPourSignalement = async () => {
  const res = await fetch(`${BASE_URL}/equipements/signalement`, {
    headers: getHeaders()
  })
  return handleResponse(res, 'Erreur lors du chargement des équipements à signaler')
}

export const createSignalement = async (data) => {
  const res = await fetch(`${BASE_URL}/signalements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res, 'Erreur lors de la création du signalement')
}

export const getHistorique = async (userId) => {
  const res = await fetch(`${BASE_URL}/historique/${userId}`, {
    headers: getHeaders()
  })
  return handleResponse(res, 'Erreur lors du chargement de l\'historique')
}

export const getDashboardProf = async (userId) => {
  const res = await fetch(`${BASE_URL}/dashboard-prof/${userId}`, {
    headers: getHeaders()
  })
  return handleResponse(res, 'Erreur lors du chargement du dashboard')
}
