import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── DEMANDE ÉQUIPEMENT (EMPRUNT) ────────────────────────────────────────────

export const getEquipementsDisponibles = async (req, res) => {
    try {
        const equipements = await prisma.equipement.findMany({
            where: { etat: { in: ['NEUF', 'BON_ETAT'] }, quantite: { gt: 0 } },
            include: { laboratoire: true }
        });
        res.json(equipements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const demanderEquipement = async (req, res) => {
    try {
        const { equipement_id, motif, demandeur_id } = req.body;
        const demande = await prisma.demande.create({
            data: {
                type: 'EMPRUNT',
                statut: 'EN_ATTENTE',
                motif,
                demandeur_id: parseInt(demandeur_id),
                equipement_id: parseInt(equipement_id)
            },
            include: { equipement: true, demandeur: true }
        });
        res.status(201).json(demande);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── DEMANDE LABORATOIRE ──────────────────────────────────────────────────────

export const getLaboratoires = async (req, res) => {
    try {
        const laboratoires = await prisma.laboratoire.findMany({
            include: { responsable: true }
        });
        res.json(laboratoires);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const demanderLaboratoire = async (req, res) => {
    try {
        const { laboratoire_id, motif, demandeur_id } = req.body;
        const demande = await prisma.demande.create({
            data: {
                type: 'LABORATOIRE',
                statut: 'EN_ATTENTE',
                motif,
                demandeur_id: parseInt(demandeur_id),
                laboratoire_id: parseInt(laboratoire_id)
            },
            include: { laboratoire: true, demandeur: true }
        });
        res.status(201).json(demande);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── SIGNALEMENT ──────────────────────────────────────────────────────────────

export const getEquipementsPourSignalement = async (req, res) => {
    try {
        const equipements = await prisma.equipement.findMany({
            include: { laboratoire: true }
        });
        res.json(equipements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const signalerEquipement = async (req, res) => {
    try {
        const { equipement_id, description, professeur_id } = req.body;
        const signalement = await prisma.signalement.create({
            data: {
                description,
                statut: 'EN_ATTENTE',
                equipement_id: parseInt(equipement_id),
                professeur_id: parseInt(professeur_id)
            },
            include: { equipement: true, professeur: true }
        });
        res.status(201).json(signalement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── HISTORIQUE ───────────────────────────────────────────────────────────────

export const getHistorique = async (req, res) => {
    try {
        const { userId } = req.params;
        const demandes = await prisma.demande.findMany({
            where: { demandeur_id: parseInt(userId) },
            include: { equipement: true, laboratoire: true, valideur: true },
            orderBy: { date_demande: 'desc' }
        });
        const signalements = await prisma.signalement.findMany({
            where: { professeur_id: parseInt(userId) },
            include: { equipement: true },
            orderBy: { date: 'desc' }
        });
        res.json({ demandes, signalements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── DASHBOARD PROFESSEUR ─────────────────────────────────────────────────────

export const getDashboardProf = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Récupérer les demandes du professeur
        const demandes = await prisma.demande.findMany({
            where: { demandeur_id: parseInt(userId) },
            orderBy: { date_demande: 'desc' }
        });

        // Récupérer les signalements du professeur
        const signalements = await prisma.signalement.findMany({
            where: { professeur_id: parseInt(userId) }
        });

        // Calculer les statistiques
        const demandesTotal = demandes.length;
        const demandesEnAttente = demandes.filter(d => d.statut === 'EN_ATTENTE').length;
        const demandesValidees = demandes.filter(d => d.statut === 'VALIDEE').length;
        const signalementsTotal = signalements.length;
        const signalementsEnAttente = signalements.filter(s => s.statut === 'EN_ATTENTE').length;

        res.json({
            demandesTotal,
            demandesEnAttente,
            demandesValidees,
            signalementsTotal,
            signalementsEnAttente
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export const getDashboard = async (req, res) => {
    try {
        const id = parseInt(req.params.userId);
        const [totalDemandes, demandesEnAttente, demandesValidees, demandesRefusees, totalSignalements] = await Promise.all([
            prisma.demande.count({ where: { demandeur_id: id } }),
            prisma.demande.count({ where: { demandeur_id: id, statut: 'EN_ATTENTE' } }),
            prisma.demande.count({ where: { demandeur_id: id, statut: { in: ['VALIDEE', 'AFFECTEE'] } } }),
            prisma.demande.count({ where: { demandeur_id: id, statut: 'REFUSEE' } }),
            prisma.signalement.count({ where: { professeur_id: id } })
        ]);
        res.json({ totalDemandes, demandesEnAttente, demandesValidees, demandesRefusees, totalSignalements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};