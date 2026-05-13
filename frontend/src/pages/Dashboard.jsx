import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, schoolsAPI, usersAPI, studentsAPI } from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter perfil do usuário
        const profileResponse = await authAPI.getProfile();
        setUser(profileResponse.data);

        // Buscar estatísticas baseado no papel
        if (profileResponse.data.papel === 'ADMIN_DISTRITAL') {
          const statsResponse = await usersAPI.getCountByRole();
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Gestão Escolar
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.nome}</span>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card de Boas-vindas */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">Bem-vindo</h2>
            <p className="text-gray-600">Papel: {user?.papel.replace(/_/g, ' ')}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>

          {/* Stats para Admin */}
          {user?.papel === 'ADMIN_DISTRITAL' && stats && (
            <>
              <div className="card bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-900">Admin Distrital</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.adminDistrital}</p>
              </div>
              <div className="card bg-green-50">
                <h3 className="text-lg font-semibold text-green-900">Diretores</h3>
                <p className="text-3xl font-bold text-green-600">{stats.diretorEscola}</p>
              </div>
              <div className="card bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-900">Professores</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.professorOperador}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
