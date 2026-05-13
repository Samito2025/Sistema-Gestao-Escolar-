import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRE = process.env.JWT_EXPIRE || '7d';

export const gerarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
};

export const verificarToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (erro) {
    throw new Error('Token inválido ou expirado');
  }
};

export const decodificarToken = (token) => {
  return jwt.decode(token);
};
