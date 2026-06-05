import db from '../lib/prisma.js'

// ===== EQUIPEMENTS DU LABO =====

export const getEquipementsLabo = async (req, res) => {
  try {
    const { userId } = req.params

    // Trouver le laboratoire dont cet utilisateur est responsable
    const laboratoire = await db.laboratoire.findFirst({
      where: { responsable_id: parseInt(userId) }
    })

    if (!laboratoire) {
      return res.status(404).json({ message: "Aucun laboratoire assigné à cet utilisateur" })
    }

    const equipements = await db.equipement.findMany({
      where: { laboratoire_id: laboratoire.id },
      include: { laboratoire: true, mouvements: true }
    })

    res.json({ laboratoire, equipements })
  } catch (error) {
    console.error("Erreur getEquipementsLabo:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== DISPONIBILITE & ETAT =====

export const getDisponibiliteLabo = async (req, res) => {
  try {
    const { userId } = req.params

    const laboratoire = await db.laboratoire.findFirst({
      where: { responsable_id: parseInt(userId) }
    })

    if (!laboratoire) {
      return res.status(404).json({ message: "Aucun laboratoire assigné à cet utilisateur" })
    }

    const equipements = await db.equipement.findMany({
      where: { laboratoire_id: laboratoire.id },
      select: {
        id: true,
        reference: true,
        designation: true,
        categorie: true,
        etat: true,
        quantite: true,
        localisation: true
      }
    })

    // Stats par état
    const stats = {
      total: equipements.length,
      NEUF: equipements.filter(e => e.etat === 'NEUF').length,
      BON_ETAT: equipements.filter(e => e.etat === 'BON_ETAT').length,
      EN_PANNE: equipements.filter(e => e.etat === 'EN_PANNE').length,
      EN_MAINTENANCE: equipements.filter(e => e.etat === 'EN_MAINTENANCE').length,
      REFORME: equipements.filter(e => e.etat === 'REFORME').length,
    }

    res.json({ laboratoire, equipements, stats })
  } catch (error) {
    console.error("Erreur getDisponibiliteLabo:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== DEMANDES =====

export const getDemandes = async (req, res) => {
  try {
    const { userId } = req.params

    const demandes = await db.demande.findMany({
      where: { demandeur_id: parseInt(userId) },
      include: {
        equipement: true,
        valideur: {
          select: { id: true, nom: true, prenom: true }
        }
      },
      orderBy: { date_demande: 'desc' }
    })

    res.json(demandes)
  } catch (error) {
    console.error("Erreur getDemandes:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const createDemande = async (req, res) => {
  try {
    const { type, motif, equipement_id, demandeur_id } = req.body

    if (!type || !demandeur_id) {
      return res.status(400).json({ message: "Type et demandeur_id sont requis" })
    }

    const demande = await db.demande.create({
      data: {
        type,
        motif,
        statut: 'EN_ATTENTE',
        demandeur_id: parseInt(demandeur_id),
        equipement_id: equipement_id ? parseInt(equipement_id) : null
      },
      include: {
        equipement: true,
        demandeur: {
          select: { id: true, nom: true, prenom: true }
        }
      }
    })

    res.status(201).json(demande)
  } catch (error) {
    console.error("Erreur createDemande:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}
export const getDashboardLabo = async (req, res) => {
  try {
    const { userId } = req.params

    const laboratoire = await db.laboratoire.findFirst({
      where: { responsable_id: parseInt(userId) }
    })

    if (!laboratoire) {
      return res.status(404).json({ message: "Aucun laboratoire assigné" })
    }

    const [equipements, demandes] = await Promise.all([
      db.equipement.findMany({ where: { laboratoire_id: laboratoire.id } }),
      db.demande.findMany({ where: { demandeur_id: parseInt(userId) } })
    ])

    res.json({
      totalEquipements:  equipements.length,
      disponibles:       equipements.filter(e => e.etat === 'BON_ETAT' || e.etat === 'NEUF').length,
      enPanne:           equipements.filter(e => e.etat === 'EN_PANNE').length,
      demandesTotal:     demandes.length,
    })
  } catch (error) {
    console.error("Erreur getDashboardLabo:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== DEMANDES LABORATOIRE (PROFESSEUR) =====

export const getDemandesLaboratoire = async (req, res) => {
  try {
    const { userId } = req.params

    // Récupérer toutes les demandes de salle en attente (pas limité au labo du responsable)
    const demandes = await db.demande.findMany({
      where: { type: 'LABORATOIRE', statut: 'EN_ATTENTE' },
      include: {
        demandeur: { select: { id: true, nom: true, prenom: true } },
        laboratoire: true
      },
      orderBy: { date_demande: 'desc' }
    })

    res.json(demandes)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const traiterDemandeLaboratoire = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, valideur_id } = req.body

    if (!['AFFECTEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" })
    }

    const demande = await db.demande.update({
      where: { id: parseInt(id) },
      data: { statut, valideur_id: parseInt(valideur_id) },
      include: {
        demandeur: { select: { id: true, nom: true, prenom: true } },
        laboratoire: true
      }
    })

    res.json(demande)
  } catch (error) {
    console.error("Erreur traiterDemandeLaboratoire:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== SIGNALEMENTS DU LABORATOIRE =====

export const getSignalementsLabo = async (req, res) => {
  try {
    const { userId } = req.params

    // Trouver le labo dont cet utilisateur est responsable
    const laboratoire = await db.laboratoire.findFirst({
      where: { responsable_id: parseInt(userId) }
    })

    if (!laboratoire) {
      return res.status(404).json({ message: "Aucun laboratoire assigné" })
    }

    const signalements = await db.signalement.findMany({
      where: { equipement: { laboratoire_id: laboratoire.id } },
      include: {
        professeur: { select: { id: true, nom: true, prenom: true, email: true } },
        equipement: true
      },
      orderBy: { date: 'desc' }
    })

    res.json(signalements)
  } catch (error) {
    console.error("Erreur getSignalementsLabo:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}