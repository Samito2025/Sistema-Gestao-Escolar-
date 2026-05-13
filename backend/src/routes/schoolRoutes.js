import express from 'express';
import { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool, getSchoolsByDistrict, getSchoolStatistics } from '../controllers/schoolController.js';
import { autenticar, verificarPapel } from '../middleware/auth.js';

const router = express.Router();

router.use(autenticar);

// CRUD
router.post('/', verificarPapel('ADMIN_DISTRITAL'), createSchool);
router.get('/', getAllSchools);
router.get('/:id', getSchoolById);
router.get('/:id/stats', getSchoolStatistics);
router.put('/:id', verificarPapel('ADMIN_DISTRITAL', 'DIRETOR_ESCOLA'), updateSchool);
router.delete('/:id', verificarPapel('ADMIN_DISTRITAL'), deleteSchool);

// Rotas específicas
router.get('/district/:distrito', getSchoolsByDistrict);

export default router;
