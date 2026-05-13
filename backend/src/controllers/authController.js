import bcryptjs from 'bcryptjs';
import prisma from '../config/database.js';
import { gerarToken, verificarToken } from '../config/jwt.js';

// ========== REGISTER ==========
export const register = async (req, res) => {
  try {
    const { email, username, senha, nome, papel } = req.body;

    // Validação básica
    if (!email || !username || !senha || !nome) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: 'Email ou username já registado' });
    }

    // Hash da senha
    const senhaHash = await bcryptjs.hash(senha, 10);

    // Criar usuário
    const usuario = await prisma.user.create({
      data: {
        email,
        username,
        senha: senhaHash,
        nome,
        papel: papel || 'PROFESSOR_OPERADOR',
        status: 'ATIVO'
      },
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        criadoEm: true
      }
    });

    res.status(201).json({
      message: 'Utilizador criado com sucesso',
      usuario
    });
  } catch (erro) {
    console.error('Erro no registro:', erro);
    res.status(500).json({ error: 'Erro ao criar utilizador' });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Procurar usuário
    const usuario = await prisma.user.findUnique({
      where: { email },
      include: {
        escola: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        }
      }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar status
    if (usuario.status !== 'ATIVO') {
      return res.status(403).json({ error: 'Utilizador inativo ou suspenso' });
    }

    // Verificar senha
    const senhaValida = await bcryptjs.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = gerarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      papel: usuario.papel,
      escolaId: usuario.escolaId
    });

    // Atualizar último login
    await prisma.user.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() }
    });

    // Registar login no audit log
    await prisma.auditLog.create({
      data: {
        usuarioId: usuario.id,
        acao: 'LOGIN',
        tabela: 'User',
        ip: req.ip
      }
    });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        papel: usuario.papel,
        escola: usuario.escola
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// ========== REFRESH TOKEN ==========
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    // Verificar token
    const decoded = verificarToken(token);

    // Verificar se usuário ainda existe e está ativo
    const usuario = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || usuario.status !== 'ATIVO') {
      return res.status(401).json({ error: 'Utilizador inválido ou inativo' });
    }

    // Gerar novo token
    const novoToken = gerarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      papel: usuario.papel,
      escolaId: usuario.escolaId
    });

    res.json({
      message: 'Token renovado com sucesso',
      token: novoToken
    });
  } catch (erro) {
    console.error('Erro ao renovar token:', erro);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// ========== LOGOUT ==========
export const logout = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Registar logout no audit log
    await prisma.auditLog.create({
      data: {
        usuarioId,
        acao: 'LOGOUT',
        tabela: 'User',
        ip: req.ip
      }
    });

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (erro) {
    console.error('Erro no logout:', erro);
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
};

// ========== GET PROFILE ==========
export const getProfile = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const usuario = await prisma.user.findUnique({
      where: { id: usuarioId },
      include: {
        escola: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            localidade: true,
            distrito: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        status: true,
        escolaId: true,
        escola: true,
        ultimoLogin: true,
        criadoEm: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    console.error('Erro ao obter perfil:', erro);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
};

// ========== CHANGE PASSWORD ==========
export const changePassword = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { senhaAtual, senhaNova } = req.body;

    if (!senhaAtual || !senhaNova) {
      return res.status(400).json({ error: 'Senha atual e nova são obrigatórias' });
    }

    // Obter usuário
    const usuario = await prisma.user.findUnique({
      where: { id: usuarioId }
    });

    // Verificar senha atual
    const senhaValida = await bcryptjs.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const senhaHash = await bcryptjs.hash(senhaNova, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: usuarioId },
      data: { senha: senhaHash }
    });

    // Registar no audit log
    await prisma.auditLog.create({
      data: {
        usuarioId,
        acao: 'CHANGE_PASSWORD',
        tabela: 'User',
        ip: req.ip
      }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (erro) {
    console.error('Erro ao alterar senha:', erro);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
};
