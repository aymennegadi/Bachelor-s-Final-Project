import db from '../lib/prisma.js'

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
    const { reference, designation, categorie, etat, quantite, prix, localisation, date_acquisition, laboratoire_id, magasinier_id } = req.body

    const equipement = await db.equipement.create({
      data: { reference, designation, categorie, etat, quantite, prix, localisation, date_acquisition, laboratoire_id }
    })

    if (magasinier_id) {
      await db.mouvement.create({
        data: {
          type: 'ENTREE',
          quantite: quantite,
          motif: 'Réception équipement',
          equipement_id: equipement.id,
          magasinier_id: parseInt(magasinier_id),
          laboratoire_id: laboratoire_id ? parseInt(laboratoire_id) : null
        }
      })
    }

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
    await db.mouvement.deleteMany({ where: { equipement_id: parseInt(id) } })
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

// ===== DEMANDES VALIDEES =====

export const getDemandesValidees = async (req, res) => {
  try {
    const demandes = await db.demande.findMany({
      where: { statut: 'VALIDEE', type: { not: 'EMPRUNT' } },
      include: {
        demandeur: { select: { id: true, nom: true, prenom: true } },
        equipement: true
      },
      orderBy: { date_demande: 'desc' }
    })
    res.json(demandes)
  } catch (error) {
    console.error("Erreur getDemandesValidees:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const marquerReceptionnee = async (req, res) => {
  try {
    const { id } = req.params
    const demande = await db.demande.update({
      where: { id: parseInt(id) },
      data: { statut: 'RECEPTIONNEE' }
    })
    res.json(demande)
  } catch (error) {
    console.error("Erreur marquerReceptionnee:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== DEMANDES EMPRUNT (PROFESSEUR) =====

export const getDemandesEmprunt = async (req, res) => {
  try {
    const demandes = await db.demande.findMany({
      where: { type: 'EMPRUNT' },
      include: {
        demandeur: { select: { id: true, nom: true, prenom: true, email: true } },
        equipement: true
      },
      orderBy: { date_demande: 'desc' }
    })
    res.json(demandes)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== SIGNALEMENTS =====

export const getSignalements = async (req, res) => {
  try {
    const signalements = await db.signalement.findMany({
      include: {
        professeur: { select: { id: true, nom: true, prenom: true, email: true } },
        equipement: true
      },
      orderBy: { date: 'desc' }
    })
    res.json(signalements)
  } catch (error) {
    console.error("Erreur getSignalements:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const traiterSignalement = async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body

    if (!['EN_ATTENTE', 'EN_COURS', 'RESOLU'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" })
    }

    const signalement = await db.signalement.update({
      where: { id: parseInt(id) },
      data: { statut },
      include: {
        professeur: { select: { id: true, nom: true, prenom: true } },
        equipement: true
      }
    })
    res.json(signalement)
  } catch (error) {
    console.error("Erreur traiterSignalement:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const traiterDemandeEmprunt = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, magasinier_id } = req.body

    if (!['VALIDEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" })
    }

    // Récupérer la demande avec l'équipement
    const demande = await db.demande.findUnique({
      where: { id: parseInt(id) },
      include: { equipement: true }
    })

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" })
    }

    // Si validation, vérifier que l'équipement existe et est disponible
    if (statut === 'VALIDEE') {
      if (!demande.equipement) {
        return res.status(400).json({ message: "Équipement non trouvé" })
      }

      // Vérifier que l'équipement est en bon état et disponible
      if (!['NEUF', 'BON_ETAT'].includes(demande.equipement.etat)) {
        return res.status(400).json({ message: "Équipement non disponible (mauvais état)" })
      }

      if (demande.equipement.quantite <= 0) {
        return res.status(400).json({ message: "Équipement non disponible (stock épuisé)" })
      }
    }

    // Mettre à jour la demande
    const updatedDemande = await db.demande.update({
      where: { id: parseInt(id) },
      data: { statut, valideur_id: parseInt(magasinier_id) },
      include: { equipement: true }
    })

    res.json(updatedDemande)
  } catch (error) {
    console.error("Erreur traiterDemandeEmprunt:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}