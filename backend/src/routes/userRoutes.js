import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUsersBySchool, getUsersCountByRole } from '../controllers/userController.js';
import { autenticar, verificarPapel } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação e Admin Distrital
router.use(autenticar, verificarPapel('ADMIN_DISTRITAL'));

// CRUD completo
router.get('/', getAllUsers);
router.get('/count/role', getUsersCountByRole);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Rotas específicas
router.get('/school/:escolaId', getUsersBySchool);

export default router;
