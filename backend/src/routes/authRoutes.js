import express from 'express';
import { register, login, refreshToken, logout, getProfile, changePassword } from '../controllers/authController.js';
import { autenticar } from '../middleware/auth.js';
import { validateRegister, validateLogin, validateChangePassword, handleValidationErrors } from '../validators/authValidator.js';

const router = express.Router();

// Rotas públicas
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);

// Rotas protegidas
router.post('/logout', autenticar, logout);
router.get('/profile', autenticar, getProfile);
router.post('/change-password', autenticar, validateChangePassword, handleValidationErrors, changePassword);

export default router;
