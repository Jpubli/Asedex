import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Asedex Presupuestos</h1>
      <p className="mb-8">Sistema de gestión de presupuestos para instalación de ascensores en fincas antiguas</p>
      <div className="space-x-4">
        <Link to="/clients" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Gestionar Clientes</Link>
        <Link to="/budgets" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Crear Presupuesto</Link>
      </div>
    </div>
  );
};

export default Home;