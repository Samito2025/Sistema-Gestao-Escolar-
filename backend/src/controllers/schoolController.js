import prisma from '../config/database.js';

// ========== CREATE SCHOOL ==========
export const createSchool = async (req, res) => {
  try {
    const { nome, codigo, localidade, distrito, provincia, latitude, longitude, contacto, email, diretorId } = req.body;

    // Validação
    if (!nome || !codigo || !localidade || !distrito || !provincia) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, codigo, localidade, distrito, provincia' });
    }

    // Verificar se código já existe
    const codigoExistente = await prisma.school.findUnique({
      where: { codigo }
    });

    if (codigoExistente) {
      return res.status(409).json({ error: 'Código de escola já existe' });
    }

    // Criar escola
    const escola = await prisma.school.create({
      data: {
        nome,
        codigo,
        localidade,
        distrito,
        provincia,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        contacto: contacto || null,
        email: email || null,
        diretorId: diretorId ? parseInt(diretorId) : null
      }
    });

    res.status(201).json({
      message: 'Escola criada com sucesso',
      escola
    });
  } catch (erro) {
    console.error('Erro ao criar escola:', erro);
    res.status(500).json({ error: 'Erro ao criar escola' });
  }
};

// ========== GET ALL SCHOOLS ==========
export const getAllSchools = async (req, res) => {
  try {
    const { distrito, provincia, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtro
    const where = {};
    if (distrito) where.distrito = distrito;
    if (provincia) where.provincia = provincia;

    // Buscar escolas
    const escolas = await prisma.school.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        director: {
          select: { id: true, nome: true, email: true }
        }
      },
      orderBy: { nome: 'asc' }
    });

    // Total de registros
    const total = await prisma.school.count({ where });

    res.json({
      data: escolas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar escolas:', erro);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

// ========== GET SCHOOL BY ID ==========
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const escola = await prisma.school.findUnique({
      where: { id: parseInt(id) },
      include: {
        director: {
          select: { id: true, nome: true, email: true }
        },
        usuarios: {
          select: { id: true, nome: true, papel: true }
        },
        alunos: {
          select: { id: true, nomeCompleto: true }
        }
      }
    });

    if (!escola) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }

    // Contar estatísticas
    const totalAlunos = await prisma.student.count({ where: { escolaId: parseInt(id) } });
    const totalProfessores = await prisma.teacher.count({ where: { escolaId: parseInt(id) } });
    const totalTurmas = await prisma.class.count({ where: { escolaId: parseInt(id) } });

    res.json({
      ...escola,
      estatisticas: {
        totalAlunos,
        totalProfessores,
        totalTurmas
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar escola:', erro);
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
};

// ========== UPDATE SCHOOL ==========
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, localidade, distrito, provincia, latitude, longitude, contacto, email, diretorId } = req.body;

    // Verificar se escola existe
    const escolaExistente = await prisma.school.findUnique({
      where: { id: parseInt(id) }
    });

    if (!escolaExistente) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }

    // Atualizar escola
    const escolaAtualizada = await prisma.school.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome || undefined,
        localidade: localidade || undefined,
        distrito: distrito || undefined,
        provincia: provincia || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        contacto: contacto || undefined,
        email: email || undefined,
        diretorId: diretorId ? parseInt(diretorId) : undefined
      }
    });

    res.json({
      message: 'Escola atualizada com sucesso',
      escola: escolaAtualizada
    });
  } catch (erro) {
    console.error('Erro ao atualizar escola:', erro);
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
};

// ========== DELETE SCHOOL ==========
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se escola existe
    const escolaExistente = await prisma.school.findUnique({
      where: { id: parseInt(id) }
    });

    if (!escolaExistente) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }

    // Deletar escola
    await prisma.school.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Escola deletada com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar escola:', erro);
    res.status(500).json({ error: 'Erro ao deletar escola' });
  }
};

// ========== GET SCHOOLS BY DISTRICT ==========
export const getSchoolsByDistrict = async (req, res) => {
  try {
    const { distrito } = req.params;

    const escolas = await prisma.school.findMany({
      where: { distrito },
      select: {
        id: true,
        nome: true,
        codigo: true,
        localidade: true,
        latitude: true,
        longitude: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(escolas);
  } catch (erro) {
    console.error('Erro ao buscar escolas do distrito:', erro);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

// ========== GET SCHOOL STATISTICS ==========
export const getSchoolStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const escola = await prisma.school.findUnique({
      where: { id: parseInt(id) }
    });

    if (!escola) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }

    // Contar dados
    const totalAlunos = await prisma.student.count({ where: { escolaId: parseInt(id) } });
    const alunosAtivos = await prisma.student.count({ where: { escolaId: parseInt(id), status: 'ATIVO' } });
    const totalProfessores = await prisma.teacher.count({ where: { escolaId: parseInt(id) } });
    const totalTurmas = await prisma.class.count({ where: { escolaId: parseInt(id) } });

    // Desempenho
    const aprovados = await prisma.performance.count({
      where: {
        aluno: { escolaId: parseInt(id) },
        status: 'APROVADO'
      }
    });

    const reprovados = await prisma.performance.count({
      where: {
        aluno: { escolaId: parseInt(id) },
        status: 'REPROVADO'
      }
    });

    const taxaAprovacao = aprovados + reprovados > 0 ? ((aprovados / (aprovados + reprovados)) * 100).toFixed(2) : 0;

    res.json({
      escola: { id: escola.id, nome: escola.nome, codigo: escola.codigo },
      alunos: {
        total: totalAlunos,
        ativos: alunosAtivos,
        inativos: totalAlunos - alunosAtivos
      },
      pessoal: {
        professores: totalProfessores
      },
      estrutura: {
        turmas: totalTurmas
      },
      desempenho: {
        aprovados,
        reprovados,
        taxaAprovacao: parseFloat(taxaAprovacao)
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
