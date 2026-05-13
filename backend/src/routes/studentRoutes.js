import express from 'express';
import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentsByClass, getStudentsStatistics } from '../controllers/studentController.js';
import { autenticar, verificarPapel } from '../middleware/auth.js';

const router = express.Router();

router.use(autenticar);

// CRUD
router.post('/', verificarPapel('DIRETOR_ESCOLA', 'PROFESSOR_OPERADOR', 'ADMIN_DISTRITAL'), createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', verificarPapel('DIRETOR_ESCOLA', 'PROFESSOR_OPERADOR'), updateStudent);
router.delete('/:id', verificarPapel('DIRETOR_ESCOLA', 'ADMIN_DISTRITAL'), deleteStudent);

// Rotas específicas
router.get('/class/:turmaId', getStudentsByClass);
router.get('/school/:escolaId/stats', getStudentsStatistics);

export default router;
