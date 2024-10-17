import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Save } from 'lucide-react';
import { api } from '../api/api';

// ... (keep the existing interfaces and imports)

const Clients: React.FC = () => {
  // ... (keep the existing state declarations)

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching clients...');
      const data = await api.getClients();
      console.log('Clients fetched successfully:', data);
      setClients(data);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'Error al cargar los clientes. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ... (keep the rest of the component code)

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {loading && <div className="text-center">Cargando...</div>}
      {/* ... (keep the rest of the JSX) */}
    </div>
  );
};

export default Clients;