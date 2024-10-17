import axios, { AxiosError } from 'axios';

const API_URL = '/api';

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error('API Error:', axiosError.message);
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data);
      console.error('Response status:', axiosError.response.status);
      console.error('Response headers:', axiosError.response.headers);
    } else if (axiosError.request) {
      console.error('Request:', axiosError.request);
    }
    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('La conexión al servidor ha expirado. Por favor, inténtelo de nuevo más tarde.');
    }
    if (!axiosError.response) {
      throw new Error('No se pudo conectar al servidor. Por favor, verifique su conexión a internet y vuelva a intentarlo.');
    }
    throw new Error(`Error del servidor: ${axiosError.response.status}`);
  } else {
    console.error('Unexpected error:', error);
    throw new Error('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
  }
};

const api = {
  getModules: async () => {
    try {
      const response = await axios.get(`${API_URL}/modules`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  addModule: async (moduleData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/modules`, moduleData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateModule: async (id: number, moduleData: FormData) => {
    try {
      const response = await axios.put(`${API_URL}/modules/${id}`, moduleData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteModule: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/modules/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getClients: async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  addClient: async (clientData: any) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateClient: async (id: number, clientData: any) => {
    try {
      const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteClient: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getBudgets: async () => {
    try {
      const response = await axios.get(`${API_URL}/budgets`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  addBudget: async (budgetData: any) => {
    try {
      const response = await axios.post(`${API_URL}/budgets`, budgetData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateBudget: async (id: number, budgetData: any) => {
    try {
      const response = await axios.put(`${API_URL}/budgets/${id}`, budgetData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteBudget: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/budgets/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export { api };