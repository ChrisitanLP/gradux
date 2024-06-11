import axios from 'axios';

const API_URL = 'http://localhost:5000/api/actividades'; // Ruta de la API para informes

export const fetchActivities = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.activities;
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    throw error;
  }
};

export const createActivity = async (activityData) => {
  try {
    const response = await axios.post(API_URL, activityData);
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId) => {
  try {
    const response = await axios.delete(`${API_URL}/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    throw error;
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await axios.put(`${API_URL}/${activityId}`, activityData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    throw error;
  }
};

export const getActivityById = async (activityId) => {
  try {
    const response = await axios.get(`${API_URL}/${activityId}`);
    return response.data.report;
  } catch (error) {
    console.error('Error al obtener actividad por ID:', error);
    throw error;
  }
};
