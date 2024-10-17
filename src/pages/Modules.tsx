import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Edit, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { api } from '../api/api';

// ... (keep existing interfaces)

const Modules: React.FC = () => {
  // ... (keep existing state declarations)

  useEffect(() => {
    console.log('Modules component mounted');
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      console.log('Fetching modules...');
      const response = await api.getModules();
      console.log('Modules fetched:', response);
      setModules(response);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      setError('Error al cargar los módulos. Por favor, intenta de nuevo.');
    }
  };

  // ... (keep the rest of the component code)

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Módulos</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      {/* ... (keep the rest of the JSX) */}
    </div>
  );
};

export default Modules;