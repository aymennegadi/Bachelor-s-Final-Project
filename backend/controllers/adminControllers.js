import db from '../lib/prisma.js'
import bcrypt from 'bcryptjs'

// ===== UTILISATEURS =====

export const getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await db.utilisateur.findMany({
      include: { role: true }
    })
    res.json(utilisateurs)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, mot_de_passe, role_id } = req.body
    console.log("body reçu:", req.body)
    const hash = await bcrypt.hash(mot_de_passe, 10)
    const utilisateur = await db.utilisateur.create({
      data: { nom, prenom, email, telephone, mot_de_passe: hash, role_id }
    })
    res.json(utilisateur)
  } catch (error) {
    console.error("Erreur createUtilisateur:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, prenom, email, telephone, role_id } = req.body
    const utilisateur = await db.utilisateur.update({
      where: { id: parseInt(id) },
      data: { nom, prenom, email, telephone, role_id }
    })
    res.json(utilisateur)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const deleteUtilisateur = async (req, res) => {
  try {
    const { id } = req.params
    await db.utilisateur.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Utilisateur supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== LABORATOIRES =====

export const getLaboratoires = async (req, res) => {
  try {
    const laboratoires = await db.laboratoire.findMany({
      include: { responsable: true }
    })
    res.json(laboratoires)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const createLaboratoire = async (req, res) => {
  try {
    const { nom, code, description, responsable_id } = req.body
    const laboratoire = await db.laboratoire.create({
      data: { nom, code, description, responsable_id }
    })
    res.json(laboratoire)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const updateLaboratoire = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, code, description, responsable_id } = req.body
    const laboratoire = await db.laboratoire.update({
      where: { id: parseInt(id) },
      data: { nom, code, description, responsable_id }
    })
    res.json(laboratoire)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const deleteLaboratoire = async (req, res) => {
  try {
    const { id } = req.params
    await db.laboratoire.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Laboratoire supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}


export const getRoles = async (req, res) => {
  try {
    const roles = await db.role.findMany()
    res.json(roles)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== EQUIPEMENTS =====

export const getEquipements = async (req, res) => {
  try {
    const equipements = await db.equipement.findMany({
      include: { laboratoire: true, mouvements: true }
    })
    res.json(equipements)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const createEquipement = async (req, res) => {
  try {
    const { reference, designation, categorie, etat, quantite, prix, localisation, date_acquisition, laboratoire_id } = req.body
    const equipement = await db.equipement.create({
      data: { reference, designation, categorie, etat, quantite, prix, localisation, date_acquisition, laboratoire_id }
    })
    res.json(equipement)
  } catch (error) {
    console.error("Erreur createEquipement:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const updateEquipement = async (req, res) => {
  try {
    const { id } = req.params
    const { reference, designation, categorie, etat, quantite, prix, localisation, laboratoire_id } = req.body
    const equipement = await db.equipement.update({
      where: { id: parseInt(id) },
      data: { reference, designation, categorie, etat, quantite, prix, localisation, laboratoire_id }
    })
    res.json(equipement)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const deleteEquipement = async (req, res) => {
  try {
    const { id } = req.params
    await db.equipement.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Equipement supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== MOUVEMENTS =====

export const getMouvements = async (req, res) => {
  try {
    const mouvements = await db.mouvement.findMany({
      include: { equipement: true, magasinier: true, laboratoire: true }
    })
    res.json(mouvements)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const createMouvement = async (req, res) => {
  try {
    const { type, quantite, motif, equipement_id, magasinier_id, laboratoire_id } = req.body
    const mouvement = await db.mouvement.create({
      data: { type, quantite, motif, equipement_id, magasinier_id, laboratoire_id }
    })
    res.json(mouvement)
  } catch (error) {
    console.error("Erreur createMouvement:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const updateMouvement = async (req, res) => {
  try {
    const { id } = req.params
    const { type, quantite, motif, laboratoire_id } = req.body
    const mouvement = await db.mouvement.update({
      where: { id: parseInt(id) },
      data: { type, quantite, motif, laboratoire_id }
    })
    res.json(mouvement)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const deleteMouvement = async (req, res) => {
  try {
    const { id } = req.params
    await db.mouvement.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Mouvement supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params
    const { nouveau_mot_de_passe } = req.body

    const hash = await bcrypt.hash(nouveau_mot_de_passe, 10)

    await db.utilisateur.update({
      where: { id: parseInt(id) },
      data: { mot_de_passe: hash }
    })

    res.json({ message: "Mot de passe réinitialisé avec succès" })
  } catch (error) {
    console.error("Erreur resetPassword:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}