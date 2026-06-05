import { Router } from 'express';
import {
    getEquipementsDisponibles,
    demanderEquipement,
    getLaboratoires,
    demanderLaboratoire,
    getEquipementsPourSignalement,
    signalerEquipement,
    getHistorique,
    getDashboard,
    getDashboardProf
} from '../controllers/professorControllers.js';

const router = Router();

router.get('/dashboard/:userId', getDashboard);
router.get('/dashboard-prof/:userId', getDashboardProf);
router.get('/equipements', getEquipementsDisponibles);
router.post('/demandes/equipement', demanderEquipement);
router.get('/laboratoires', getLaboratoires);
router.post('/demandes/laboratoire', demanderLaboratoire);
router.get('/equipements/signalement', getEquipementsPourSignalement);
router.post('/signalements', signalerEquipement);
router.get('/historique/:userId', getHistorique);

export default router;