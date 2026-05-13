import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username deve ter pelo menos 3 caracteres')
    .isAlphanumeric()
    .withMessage('Username deve conter apenas letras e números'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('papel')
    .optional()
    .isIn(['ADMIN_DISTRITAL', 'DIRETOR_ESCOLA', 'PROFESSOR_OPERADOR'])
    .withMessage('Papel inválido')
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

export const validateChangePassword = [
  body('senhaAtual')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  body('senhaNova')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validação falhada',
      detalhes: errors.array()
    });
  }
  next();
};
