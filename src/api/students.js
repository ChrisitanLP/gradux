import axios from 'axios';

const API_URL = 'http://localhost:5000/api/estudiantes'; // Ruta de la API para estudiantes

export const fetchStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.students;
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(`${API_URL}/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/${studentId}`);
    return response.data.student;
  } catch (error) {
    console.error('Error al obtener estudiante por ID:', error);
    throw error;
  }
};
