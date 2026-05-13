# 📚 Sistema de Gestão Escolar - Sussundenga

**Plataforma Inteligente de Estatísticas e Monitoramento Educacional**

Sistema completo para o Serviço Distrital de Educação de Sussundenga que permite recolha, análise e visualização de informações académicas, gera relatórios automáticos, ranking de escolas e recomendações de intervenção.

## 🎯 Funcionalidades Principais

### 1. **Autenticação e Controlo de Acesso**
- ✅ Login seguro com JWT
- ✅ Três níveis de acesso: Administrador Distrital, Diretor de Escola, Professor/Operador
- ✅ Controlo baseado em papéis (RBAC)
- ✅ Recuperação de senha segura

### 2. **Módulo de Recolha de Dados Escolares**
- ✅ Inscrição de alunos por género
- ✅ Estatísticas de frequência
- ✅ Taxas de aprovação/reprovação
- ✅ Dados de professores
- ✅ Dados de infraestrutura
- ✅ Relatórios mensais e por termo

### 3. **Dashboard Estatístico**
- ✅ Gráficos e visualizações interativas
- ✅ Comparação entre escolas
- ✅ Indicadores de desempenho
- ✅ Estatísticas em tempo real
- ✅ Resumos distritais

### 4. **Geração Automática de Relatórios**
- ✅ Exportação em PDF
- ✅ Exportação em Excel
- ✅ Resumos prontos para PowerPoint
- ✅ Compilação automática ao nível distrital

### 5. **Sistema de Ranking de Escolas**
- ✅ Ranking por desempenho global
- ✅ Ranking por taxa de aprovação
- ✅ Identificação de escolas críticas
- ✅ Análise de tendências

### 6. **Módulo de Recomendações e Intervenção**
- ✅ Identificação automática de áreas fracas
- ✅ Sugestões de intervenção personalizadas
- ✅ Monitoramento de progresso
- ✅ Alertas automáticos

### 7. **Dashboard de Monitoramento Distrital**
- ✅ Visão geral de todas as escolas
- ✅ Filtros por escola, localidade, período
- ✅ Alertas para indicadores críticos
- ✅ Mapas interativos (opcional)

## 🛠️ Stack Tecnológico

### Backend
```
Node.js + Express.js
REST API
JWT Authentication
Prisma ORM
PostgreSQL
```

### Frontend
```
React.js + Vite
Tailwind CSS
Recharts (Visualização)
React Router
Axios
```

### Database
```
PostgreSQL (Supabase/Neon)
Prisma Migrations
```

### Ferramentas Adicionais
```
PDFKit - Geração de PDF
ExcelJS - Exportação Excel
Multer - Upload de ficheiros
Cloudinary - Armazenamento de media
```

### Deployment
```
Frontend: Vercel
Backend: Render
Database: Supabase PostgreSQL
```

## 📁 Estrutura do Projeto

```
Sistema-Gestao-Escolar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── docs/
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js v16+
- npm ou yarn
- PostgreSQL 12+
- Git

### Instalação Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm start
```

### Instalação Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/escola_db
JWT_SECRET=seu_jwt_secret_seguro
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Sistema de Gestão Escolar
```

## 👥 Níveis de Acesso

| Papel | Permissões |
|-------|----------|
| **Admin Distrital** | Acesso total, gestão de escolas, visualização de todos os dados, geração de relatórios distritais |
| **Diretor Escola** | Gestão de dados da sua escola, visualização de estatísticas, geração de relatórios da escola |
| **Professor/Operador** | Inserção de dados, visualização limitada, sem acesso a configurações |

## 📊 Modelos de Dados Principais

- **Users**: Utilizadores com papéis e permissões
- **Schools**: Escolas do distrito
- **Students**: Alunos com dados demográficos
- **Teachers**: Professores e pessoal
- **Classes**: Turmas e inscrições
- **Attendance**: Registos de frequência
- **Performance**: Dados de desempenho (aprovação/reprovação)
- **Infrastructure**: Dados de infraestrutura escolar
- **Reports**: Relatórios gerados
- **Interventions**: Recomendações e intervenções
- **AuditLogs**: Registos de auditoria

## 📱 Responsividade

- ✅ Mobile First Design
- ✅ Desktop Otimizado
- ✅ Tablet Support
- ✅ Dark/Light Mode
- ✅ Acessibilidade WCAG 2.1

## 🌐 Idioma

- 🇵🇹 Português (Padrão)
- Estrutura preparada para internacionalização futura

## 🔒 Segurança

- ✅ JWT Token Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ CORS Configuration
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ Audit Logs
- ✅ HTTPS Ready

## 📦 Backup e Recuperação

- ✅ Backups automáticos via Supabase
- ✅ Plano de recuperação de desastres
- ✅ Versionamento de dados

## 🐛 Suporte e Contribuição

Para reportar problemas ou sugerir melhorias, abra uma issue no repositório.

## 📄 Licença

Todos os direitos reservados - Serviço Distrital de Educação de Sussundenga

---

**Desenvolvido com ❤️ para melhorar a educação em Sussundenga**

**Versão:** 1.0.0 (Em Desenvolvimento)
**Data:** Maio 2026
