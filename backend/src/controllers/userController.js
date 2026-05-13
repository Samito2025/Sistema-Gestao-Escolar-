import bcryptjs from 'bcryptjs';
import prisma from '../config/database.js';

// ========== GET ALL USERS ==========
export const getAllUsers = async (req, res) => {
  try {
    const { papel, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtro
    const where = {};
    if (papel) where.papel = papel;
    if (status) where.status = status;

    // Buscar usuários
    const usuarios = await prisma.user.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        escola: {
          select: { id: true, nome: true }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        status: true,
        escola: true,
        criadoEm: true
      },
      orderBy: { criadoEm: 'desc' }
    });

    // Total de registros
    const total = await prisma.user.count({ where });

    res.json({
      data: usuarios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// ========== GET USER BY ID ==========
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        escola: true
      },
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        status: true,
        escola: true,
        ultimoLogin: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// ========== UPDATE USER ==========
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, nome, papel, status, escolaId } = req.body;

    // Verificar se usuário existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Verificar se email já existe (excluindo o usuário atual)
    if (email && email !== usuarioExistente.email) {
      const emailExistente = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExistente) {
        return res.status(409).json({ error: 'Email já registado' });
      }
    }

    // Atualizar usuário
    const usuarioAtualizado = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email: email || undefined,
        username: username || undefined,
        nome: nome || undefined,
        papel: papel || undefined,
        status: status || undefined,
        escolaId: escolaId || undefined
      },
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        status: true,
        escolaId: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    res.json({
      message: 'Utilizador atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// ========== DELETE USER ==========
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se usuário existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Utilizador deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar usuário:', erro);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

// ========== GET USERS BY SCHOOL ==========
export const getUsersBySchool = async (req, res) => {
  try {
    const { escolaId } = req.params;
    const { papel, status } = req.query;

    // Construir filtro
    const where = { escolaId: parseInt(escolaId) };
    if (papel) where.papel = papel;
    if (status) where.status = status;

    // Buscar usuários
    const usuarios = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        nome: true,
        papel: true,
        status: true,
        criadoEm: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(usuarios);
  } catch (erro) {
    console.error('Erro ao buscar usuários da escola:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// ========== GET USERS COUNT BY ROLE ==========
export const getUsersCountByRole = async (req, res) => {
  try {
    const counts = await Promise.all([
      prisma.user.count({ where: { papel: 'ADMIN_DISTRITAL' } }),
      prisma.user.count({ where: { papel: 'DIRETOR_ESCOLA' } }),
      prisma.user.count({ where: { papel: 'PROFESSOR_OPERADOR' } })
    ]);

    res.json({
      adminDistrital: counts[0],
      diretorEscola: counts[1],
      professorOperador: counts[2],
      total: counts[0] + counts[1] + counts[2]
    });
  } catch (erro) {
    console.error('Erro ao contar usuários:', erro);
    res.status(500).json({ error: 'Erro ao contar usuários' });
  }
};
