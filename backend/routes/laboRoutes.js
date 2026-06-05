import express from 'express'
import { 
  getEquipementsLabo, getDisponibiliteLabo, getDemandes, createDemande, getDashboardLabo,
  getDemandesLaboratoire, traiterDemandeLaboratoire, getSignalementsLabo
} from '../controllers/laboControllers.js'


const router = express.Router()

// Équipements du labo du responsable
router.get('/equipements/:userId', getEquipementsLabo)

// Disponibilité & état des équipements
router.get('/disponibilite/:userId', getDisponibiliteLabo)

// Demandes du responsable labo
router.get('/demandes/:userId', getDemandes)
router.get('/dashboard/:userId', getDashboardLabo)
router.post('/demandes', createDemande)
router.get('/demandes-labo/:userId', getDemandesLaboratoire)
router.put('/demandes-labo/:id', traiterDemandeLaboratoire)

// Signalements du laboratoire
router.get('/signalements/:userId', getSignalementsLabo)

export default router