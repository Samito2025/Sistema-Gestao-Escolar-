import { Link } from 'react-router-dom';

export default function NavBar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            📚 Gestão Escolar
          </Link>
          <div className="flex items-center space-x-4">
            <span>{user.nome}</span>
            <button className="btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
