import express from 'express'
import {
  getDashboardLogistique,
  getInventaire,
  getSuiviMateriel,
  getDemandes,
  validerDemande
} from '../controllers/logistiqueControllers.js'
import { getSignalements, traiterSignalement } from '../controllers/logistiqueControllers.js'

const router = express.Router()

router.get('/dashboard',    getDashboardLogistique)
router.get('/inventaire',   getInventaire)
router.get('/suivi',        getSuiviMateriel)
router.get('/demandes',     getDemandes)
router.put('/demandes/:id', validerDemande)

router.get('/signalements', getSignalements)
router.put('/signalements/:id', traiterSignalement)

export default router