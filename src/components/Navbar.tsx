import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, FileText, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Asedex Presupuestos</Link>
        <div className="space-x-4">
          <Link to="/" className="flex items-center"><Home className="mr-1" size={18} /> Inicio</Link>
          <Link to="/clients" className="flex items-center"><Users className="mr-1" size={18} /> Clientes</Link>
          <Link to="/budgets" className="flex items-center"><FileText className="mr-1" size={18} /> Presupuestos</Link>
          <Link to="/modules" className="flex items-center"><Package className="mr-1" size={18} /> Módulos</Link>
          <button onClick={handleLogout} className="flex items-center"><LogOut className="mr-1" size={18} /> Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;