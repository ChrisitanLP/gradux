import axios from 'axios';

const API_URL = 'http://localhost:5000/api/informes'; // Ruta de la API para informes

export const fetchReports = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.reports;
  } catch (error) {
    console.error('Error al obtener informes:', error);
    throw error;
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await axios.post(API_URL, reportData);
    return response.data;
  } catch (error) {
    console.error('Error al crear informe:', error);
    throw error;
  }
};

export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(`${API_URL}/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar informe:', error);
    throw error;
  }
};

export const updateReport = async (reportId, reportData) => {
  try {
    const response = await axios.put(`${API_URL}/${reportId}`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar informe:', error);
    throw error;
  }
};

export const getReportById = async (reportId) => {
  try {
    const response = await axios.get(`${API_URL}/${reportId}`);
    return response.data.report;
  } catch (error) {
    console.error('Error al obtener informe por ID:', error);
    throw error;
  }
}; 