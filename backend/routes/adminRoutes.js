import express from 'express'
import {
  getUtilisateurs, createUtilisateur, updateUtilisateur, deleteUtilisateur,
  getLaboratoires, createLaboratoire, updateLaboratoire, deleteLaboratoire,
  getEquipements, createEquipement, updateEquipement, deleteEquipement,
  getMouvements, createMouvement, updateMouvement, deleteMouvement
} from '../controllers/adminControllers.js'
import { getRoles } from '../controllers/adminControllers.js'
import { resetPassword } from '../controllers/adminControllers.js'

const router = express.Router()

// Utilisateurs
router.get('/utilisateurs', getUtilisateurs)
router.post('/utilisateurs', createUtilisateur)
router.put('/utilisateurs/:id', updateUtilisateur)
router.delete('/utilisateurs/:id', deleteUtilisateur)

// Laboratoires
router.get('/laboratoires', getLaboratoires)
router.post('/laboratoires', createLaboratoire)
router.put('/laboratoires/:id', updateLaboratoire)
router.delete('/laboratoires/:id', deleteLaboratoire)

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

router.get('/roles', getRoles)

router.put('/utilisateurs/:id/reset-password', resetPassword)
export default router