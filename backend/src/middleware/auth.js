import { verificarToken } from '../config/jwt.js';

export const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const usuario = verificarToken(token);
    req.usuario = usuario;
    next();
  } catch (erro) {
    res.status(401).json({ error: erro.message });
  }
};

export const verificarPapel = (...papeis) => {
  return (req, res, next) => {
    if (!papeis.includes(req.usuario.papel)) {
      return res.status(403).json({
        error: 'Acesso negado. Permissões insuficientes.'
      });
    }
    next();
  };
};

export const verificarEscolaAcesso = (req, res, next) => {
  const { escolaId } = req.params;

  if (req.usuario.papel === 'ADMIN_DISTRITAL') {
    return next();
  }

  if (req.usuario.escolaId !== parseInt(escolaId)) {
    return res.status(403).json({
      error: 'Acesso negado a esta escola'
    });
  }

  next();
};
