import React, { useState, useEffect } from 'react';
import { FileText, Plus, Minus, Download, Edit, Trash2, Save } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { api } from '../api/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Module {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  units: number;
}

interface Client {
  id: number;
  name: string;
  // Add other client properties as needed
}

interface Budget {
  id: number;
  clientId: number;
  date: string;
  modules: Module[];
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget>({
    id: 0,
    clientId: 0,
    date: new Date().toISOString().split('T')[0],
    modules: []
  });
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const { toPDF, targetRef } = usePDF({ filename: 'presupuesto.pdf' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchClients();
    fetchModules();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.getBudgets();
      setBudgets(response);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching budgets:', error);
      setError('Error al cargar los presupuestos: ' + error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      setClients(response);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError('Error al cargar los clientes: ' + error.message);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.getModules();
      setModules(response);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      setError('Error al cargar los módulos: ' + error.message);
    }
  };

  const addModule = (moduleToAdd: Module) => {
    setCurrentBudget({
      ...currentBudget,
      modules: [...currentBudget.modules, { ...moduleToAdd, units: 1 }]
    });
  };

  const removeModule = (moduleId: number) => {
    setCurrentBudget({
      ...currentBudget,
      modules: currentBudget.modules.filter(m => m.id !== moduleId)
    });
  };

  const updateModuleUnits = (moduleId: number, units: number) => {
    setCurrentBudget({
      ...currentBudget,
      modules: currentBudget.modules.map(m => 
        m.id === moduleId ? { ...m, units: Math.max(1, units) } : m
      )
    });
  };

  const saveBudget = async () => {
    try {
      if (editingBudgetId) {
        await api.updateBudget(editingBudgetId, currentBudget);
      } else {
        await api.addBudget(currentBudget);
      }
      await fetchBudgets();
      setCurrentBudget({
        id: 0,
        clientId: 0,
        date: new Date().toISOString().split('T')[0],
        modules: []
      });
      setEditingBudgetId(null);
      setError(null);
    } catch (error: any) {
      console.error('Error saving budget:', error);
      setError('Error al guardar el presupuesto: ' + error.message);
    }
  };

  const editBudget = (budget: Budget) => {
    setCurrentBudget(budget);
    setEditingBudgetId(budget.id);
  };

  const deleteBudget = async (id: number) => {
    try {
      await api.deleteBudget(id);
      await fetchBudgets();
      setError(null);
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      setError('Error al eliminar el presupuesto: ' + error.message);
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById('budget-content');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('presupuesto.pdf');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {editingBudgetId ? 'Editar Presupuesto' : 'Crear Presupuesto'}
      </h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <div id="budget-content" ref={targetRef}>
        {/* Budget form */}
        <div className="mb-4">
          <label className="block mb-2">Cliente:</label>
          <select
            value={currentBudget.clientId}
            onChange={(e) => setCurrentBudget({ ...currentBudget, clientId: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Fecha:</label>
          <input
            type="date"
            value={currentBudget.date}
            onChange={(e) => setCurrentBudget({ ...currentBudget, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Módulos:</h3>
          {currentBudget.modules.map((module, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="flex-grow">{module.title}</span>
              <input
                type="number"
                value={module.units}
                onChange={(e) => updateModuleUnits(module.id, Number(e.target.value))}
                className="w-16 p-1 border rounded mr-2"
                min="1"
              />
              <button onClick={() => removeModule(module.id)} className="text-red-500">
                <Minus size={18} />
              </button>
            </div>
          ))}
          <select
            onChange={(e) => {
              const selectedModule = modules.find(m => m.id === Number(e.target.value));
              if (selectedModule) addModule(selectedModule);
            }}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="">Añadir módulo</option>
            {modules.map(module => (
              <option key={module.id} value={module.id}>{module.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <button onClick={saveBudget} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
          <Save size={18} className="mr-2" /> {editingBudgetId ? 'Guardar Cambios' : 'Guardar Presupuesto'}
        </button>
        <button onClick={exportToPDF} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
          <Download size={18} className="mr-2" /> Exportar a PDF
        </button>
      </div>
      <h3 className="text-xl font-bold mt-8 mb-4">Presupuestos Guardados</h3>
      <ul className="space-y-4">
        {budgets.map(budget => (
          <li key={budget.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <span>Cliente: {clients.find(c => c.id === budget.clientId)?.name}</span>
              <span>Fecha: {budget.date}</span>
            </div>
            <div className="mt-2">
              <button onClick={() => editBudget(budget)} className="text-blue-500 mr-2">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteBudget(budget.id)} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budgets;