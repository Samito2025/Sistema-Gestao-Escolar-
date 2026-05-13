import prisma from '../config/database.js';

// ========== CREATE STUDENT ==========
export const createStudent = async (req, res) => {
  try {
    const { nomeCompleto, genero, dataNascimento, bi, turmaId, escolaId } = req.body;

    // Validação
    if (!nomeCompleto || !genero || !dataNascimento || !bi || !turmaId || !escolaId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se BI já existe
    const biExistente = await prisma.student.findUnique({
      where: { bi }
    });

    if (biExistente) {
      return res.status(409).json({ error: 'BI já registado' });
    }

    // Verificar se turma existe
    const turmaExistente = await prisma.class.findUnique({
      where: { id: parseInt(turmaId) }
    });

    if (!turmaExistente) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    // Criar aluno
    const aluno = await prisma.student.create({
      data: {
        nomeCompleto,
        genero,
        dataNascimento: new Date(dataNascimento),
        bi,
        turmaId: parseInt(turmaId),
        escolaId: parseInt(escolaId),
        status: 'ATIVO'
      }
    });

    res.status(201).json({
      message: 'Aluno criado com sucesso',
      aluno
    });
  } catch (erro) {
    console.error('Erro ao criar aluno:', erro);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
};

// ========== GET ALL STUDENTS ==========
export const getAllStudents = async (req, res) => {
  try {
    const { escolaId, turmaId, status, genero, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtro
    const where = {};
    if (escolaId) where.escolaId = parseInt(escolaId);
    if (turmaId) where.turmaId = parseInt(turmaId);
    if (status) where.status = status;
    if (genero) where.genero = genero;

    // Buscar alunos
    const alunos = await prisma.student.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        turma: { select: { id: true, nivel: true, letra: true } },
        escola: { select: { id: true, nome: true } }
      },
      orderBy: { nomeCompleto: 'asc' }
    });

    // Total de registros
    const total = await prisma.student.count({ where });

    res.json({
      data: alunos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar alunos:', erro);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
};

// ========== GET STUDENT BY ID ==========
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const aluno = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        turma: true,
        escola: true,
        frequencia: { orderBy: { data: 'desc' }, take: 10 },
        desempenho: { orderBy: { criadoEm: 'desc' }, take: 10 }
      }
    });

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (erro) {
    console.error('Erro ao buscar aluno:', erro);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

// ========== UPDATE STUDENT ==========
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeCompleto, genero, dataNascimento, turmaId, status } = req.body;

    // Verificar se aluno existe
    const alunoExistente = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!alunoExistente) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Atualizar aluno
    const alunoAtualizado = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        nomeCompleto: nomeCompleto || undefined,
        genero: genero || undefined,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
        turmaId: turmaId ? parseInt(turmaId) : undefined,
        status: status || undefined
      }
    });

    res.json({
      message: 'Aluno atualizado com sucesso',
      aluno: alunoAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
};

// ========== DELETE STUDENT ==========
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se aluno existe
    const alunoExistente = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!alunoExistente) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Deletar aluno
    await prisma.student.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar aluno:', erro);
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
};

// ========== GET STUDENTS BY CLASS ==========
export const getStudentsByClass = async (req, res) => {
  try {
    const { turmaId } = req.params;

    const alunos = await prisma.student.findMany({
      where: { turmaId: parseInt(turmaId) },
      select: {
        id: true,
        nomeCompleto: true,
        genero: true,
        bi: true,
        status: true,
        criadoEm: true
      },
      orderBy: { nomeCompleto: 'asc' }
    });

    res.json(alunos);
  } catch (erro) {
    console.error('Erro ao buscar alunos da turma:', erro);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
};

// ========== GET STUDENTS STATISTICS ==========
export const getStudentsStatistics = async (req, res) => {
  try {
    const { escolaId } = req.params;

    // Contar por género
    const masculinos = await prisma.student.count({
      where: { escolaId: parseInt(escolaId), genero: 'MASCULINO' }
    });

    const femininos = await prisma.student.count({
      where: { escolaId: parseInt(escolaId), genero: 'FEMININO' }
    });

    // Contar por status
    const ativos = await prisma.student.count({
      where: { escolaId: parseInt(escolaId), status: 'ATIVO' }
    });

    const inativos = await prisma.student.count({
      where: { escolaId: parseInt(escolaId), status: 'INATIVO' }
    });

    const total = masculinos + femininos;

    res.json({
      total,
      genero: {
        masculinos,
        femininos,
        outro: total - masculinos - femininos
      },
      status: {
        ativos,
        inativos,
        total
      },
      percentuais: {
        masculinos: total > 0 ? ((masculinos / total) * 100).toFixed(2) : 0,
        femininos: total > 0 ? ((femininos / total) * 100).toFixed(2) : 0
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
