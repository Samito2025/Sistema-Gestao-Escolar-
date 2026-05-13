import app from './src/app.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check em http://localhost:${PORT}/health`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recebido. Fechando servidor gracefully...');
  server.close(() => {
    console.log('✅ Servidor fechado');
  });
});
