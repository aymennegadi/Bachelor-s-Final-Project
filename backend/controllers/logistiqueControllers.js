import db from '../lib/prisma.js'

// ===== DASHBOARD =====
export const getDashboardLogistique = async (req, res) => {
  try {
    const [demandes, equipements] = await Promise.all([
      db.demande.findMany(),
      db.equipement.findMany()
    ])

    res.json({
      demandesEnAttente: demandes.filter(d => d.statut === 'EN_ATTENTE').length,
      demandesValidees:  demandes.filter(d => d.statut === 'VALIDEE').length,
      demandesRefusees:  demandes.filter(d => d.statut === 'REFUSEE').length,
      totalEquipements:  equipements.length,
    })
  } catch (error) {
    console.error("Erreur getDashboardLogistique:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== INVENTAIRE GLOBAL =====
export const getInventaire = async (req, res) => {
  try {
    const equipements = await db.equipement.findMany({
      include: { laboratoire: true },
      orderBy: { id: 'desc' }
    })
    res.json(equipements)
  } catch (error) {
    console.error("Erreur getInventaire:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== SUIVI MATERIEL =====
export const getSuiviMateriel = async (req, res) => {
  try {
    const mouvements = await db.mouvement.findMany({
      include: {
        equipement: true,
        magasinier: { select: { id: true, nom: true, prenom: true } },
        laboratoire: true
      },
      orderBy: { date_mouvement: 'desc' }
    })
    res.json(mouvements)
  } catch (error) {
    console.error("Erreur getSuiviMateriel:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== DEMANDES =====
export const getDemandes = async (req, res) => {
  try {
    const demandes = await db.demande.findMany({
      include: {
        demandeur: {
          select: { id: true, nom: true, prenom: true, role: { select: { nom: true } } }
        },
        equipement: true,
        valideur: { select: { id: true, nom: true, prenom: true } }
      },
      orderBy: { date_demande: 'desc' }
    })
    res.json(demandes)
  } catch (error) {
    console.error("Erreur getDemandes:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const validerDemande = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, valideur_id } = req.body

    if (!['VALIDEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" })
    }

    const demande = await db.demande.update({
      where: { id: parseInt(id) },
      data: {
        statut,
        valideur_id: parseInt(valideur_id)
      },
      include: {
        demandeur: { select: { id: true, nom: true, prenom: true } },
        equipement: true,
        valideur:   { select: { id: true, nom: true, prenom: true } }
      }
    })

    res.json(demande)
  } catch (error) {
    console.error("Erreur validerDemande:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// ===== SIGNALEMENTS =====

export const getSignalements = async (req, res) => {
  try {
    const signalements = await db.signalement.findMany({
      include: {
        equipement: { include: { laboratoire: true } },
        professeur: { select: { id: true, nom: true, prenom: true } }
      },
      orderBy: { date: 'desc' }
    })
    res.json(signalements)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const traiterSignalement = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, etat_equipement } = req.body
    // statut : EN_ATTENTE / EN_COURS / RESOLU
    // etat_equipement : EN_MAINTENANCE / EN_PANNE / BON_ETAT etc.

    const signalement = await db.signalement.update({
      where: { id: parseInt(id) },
      data: { statut },
      include: { equipement: true }
    })

    // Mettre à jour l'état de l'équipement si fourni
    if (etat_equipement) {
      await db.equipement.update({
        where: { id: signalement.equipement_id },
        data: { etat: etat_equipement }
      })
    }

    res.json(signalement)
  } catch (error) {
    console.error("Erreur traiterSignalement:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}