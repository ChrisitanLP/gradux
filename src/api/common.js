// api/common.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchCarreras = async () => {
  try {
    const response = await axios.get(`${API_URL}/carreras`);
    return response.data.carreras || []; // Si no hay carreras, devuelve un array vacío
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    throw new Error('Error al obtener carreras'); // Lanza un error para ser manejado en el frontend
  }
};

export const fetchUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data.usuarios || []; // Si no hay usuarios, devuelve un array vacío
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('Error al obtener usuarios'); // Lanza un error para ser manejado en el frontend
  }
};

export const fetchTiposInformes = async () => {
  try {
    const response = await axios.get(`${API_URL}/tiposInforme`);
    return response.data.tiposInforme || []; // Si no hay usuarios, devuelve un array vacío
  } catch (error) {
    console.error('Error al obtener tipos de informes:', error);
    throw new Error('Error al obtener tipos de informes'); // Lanza un error para ser manejado en el frontend
  }
};

export const fetchEstudiantes = async (tutorId) => {
  try {
    const response = await axios.get(`${API_URL}/studentsbyteachers/${tutorId}`);
    return response.data.estudiantesporDocente|| []; // Si no hay usuarios, devuelve un array vacío
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    throw new Error('Error al obtener estudiantes'); // Lanza un error para ser manejado en el frontend
  }
};

