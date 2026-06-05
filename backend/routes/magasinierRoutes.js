import express from 'express'
import {
  getEquipements, createEquipement, updateEquipement, deleteEquipement,
  getMouvements, createMouvement, updateMouvement, deleteMouvement,
  getDemandesValidees, marquerReceptionnee,
  getDemandesEmprunt, traiterDemandeEmprunt,
  getSignalements, traiterSignalement
} from '../controllers/magasinierControllers.js'


const router = express.Router()

// Equipements
router.get('/equipements', getEquipements)
router.post('/equipements', createEquipement)
router.put('/equipements/:id', updateEquipement)
router.delete('/equipements/:id', deleteEquipement)

// Mouvements
router.get('/mouvements', getMouvements)
router.post('/mouvements', createMouvement)
router.put('/mouvements/:id', updateMouvement)
router.delete('/mouvements/:id', deleteMouvement)

// Demandes
router.get('/demandes-validees', getDemandesValidees)
router.put('/demandes-validees/:id/receptionner', marquerReceptionnee)

router.get('/demandes-emprunt', getDemandesEmprunt)
router.put('/demandes-emprunt/:id', traiterDemandeEmprunt)

// Signalements
router.get('/signalements', getSignalements)
router.put('/signalements/:id', traiterSignalement)

export default router