const BASE_URL = 'http://localhost:5000/api/logistique'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

export const getDashboardLogistique = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur dashboard logistique')
  return res.json()
}

export const getInventaire = async () => {
  const res = await fetch(`${BASE_URL}/inventaire`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur inventaire')
  return res.json()
}

export const getSuiviMateriel = async () => {
  const res = await fetch(`${BASE_URL}/suivi`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur suivi matériel')
  return res.json()
}

export const getDemandes = async () => {
  const res = await fetch(`${BASE_URL}/demandes`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erreur demandes')
  return res.json()
}

export const validerDemande = async (id, statut, valideur_id) => {
  const res = await fetch(`${BASE_URL}/demandes/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ statut, valideur_id })
  })
  if (!res.ok) throw new Error('Erreur validation demande')
  return res.json()
}